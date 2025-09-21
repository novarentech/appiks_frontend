import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import {
  handleAuthenticationError,
  handleExternalApiError,
  handleInternalError,
  APIError
} from "@/lib/error-handler";

export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return handleAuthenticationError("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/api/questionnaire`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return handleExternalApiError(
        `External API error: ${response.status}`,
        response.status,
        { externalError: errorText }
      );
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch questionnaire",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Success",
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
}
