import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { withCSRFProtection } from "@/lib/csrf";
import {
  handleAuthenticationError,
  handleValidationError,
  handleExternalApiError,
  handleInternalError,
  APIError,
  validateRequestBody
} from "@/lib/error-handler";

interface SubmitSurveyBody {
  answers: string[];
}

const handler = async (
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return handleAuthenticationError("Authentication required");
    }

    const { type } = await params;

    // Validate type
    if (type !== "secure" && type !== "insecure") {
      return handleValidationError(
        "Invalid type parameter. Must be 'secure' or 'insecure'",
        { receivedType: type }
      );
    }

    // Parse request body
    const body = await req.json();

    // Validate request body
    const validatedBody = validateRequestBody<SubmitSurveyBody>(body, {
      answers: (value) => {
        if (!value) return "Answers are required";
        if (!Array.isArray(value)) return "Answers must be an array";
        if (value.length === 0) return "Answers array cannot be empty";
        if (value.some(answer => typeof answer !== 'string')) {
          return "All answers must be strings";
        }
        return true;
      },
    });

    // Submit to external API
    const response = await fetch(
      `${API_BASE_URL}/questionnaire/${type}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return handleExternalApiError(
        `Failed to submit questionnaire: ${response.status}`,
        response.status,
        { externalError: errorText }
      );
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to submit questionnaire",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Survey submitted successfully",
      data: data.data,
    });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          ...(error.details && { details: error.details }),
        },
        { status: error.statusCode }
      );
    }
    
    return handleInternalError(error);
  }
};

export const POST = withCSRFProtection(handler);
