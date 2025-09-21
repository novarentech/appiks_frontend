import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { API_BASE_URL } from "@/lib/config";
import { withCSRFProtection } from "@/lib/csrf";
import {
  handleAuthenticationError,
  handleExternalApiError,
  handleInternalError,
  APIError,
  validateRequestBody
} from "@/lib/error-handler";

interface MoodRecordRequest {
  status: string;
}

interface MoodRecordResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    pesan: string;
  };
}

const handler = async (request: NextRequest) => {
  try {
    // Get session to authenticate user
    const session = await auth();

    if (!session?.user?.token) {
      return handleAuthenticationError("No authentication token");
    }

    // Parse request body
    const body = await request.json();

    // Validate request body
    const validatedBody = validateRequestBody<MoodRecordRequest>(body, {
      status: (value) => {
        if (!value) return "Status is required";
        const validStatuses = ["happy", "neutral", "sad", "angry"];
        if (!validStatuses.includes(value as string)) {
          return "Invalid status value. Must be one of: happy, neutral, sad, angry";
        }
        return true;
      },
    });

    // Call external API
    const response = await fetch(`${API_BASE_URL}/mood_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      body: JSON.stringify({ status: validatedBody.status }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("External API error:", response.status, errorData);

      return handleExternalApiError(
        `Failed to record mood: ${response.status}`,
        response.status,
        { externalError: errorData }
      );
    }

    const data: MoodRecordResponse = await response.json();

    // Return the response with additional processing if needed
    return NextResponse.json({
      success: data.success,
      message: data.message,
      data: {
        status: data.data.status,
        pesan: data.data.pesan,
        // Add additional fields for frontend processing
        isSafe: data.data.status === "Aman",
      },
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
