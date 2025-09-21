import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { API_BASE_URL } from "@/lib/config";
import {
  handleAuthenticationError,
  handleValidationError,
  handleExternalApiError,
  handleInternalError,
  APIError,
} from "@/lib/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Validate input
    if (!username) {
      return handleValidationError("Username is required");
    }

    console.log("🔍 Checking username availability:", username);

    // Get session to retrieve the access token
    const session = await auth();

    if (!session?.user?.token) {
      return handleAuthenticationError("Authentication required");
    }

    const response = await fetch(
      `${API_BASE_URL}/check-username?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("❌ Check username API error:", response.status);
      const errorText = await response.text();
      return handleExternalApiError(
        "Failed to check username",
        response.status,
        { externalError: errorText }
      );
    }

    const data = await response.json();
    console.log("✅ Username check response:", data);

    return NextResponse.json(data);
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
