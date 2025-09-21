import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { API_BASE_URL } from "@/lib/config";
import {
  handleAuthenticationError,
  handleExternalApiError,
  handleInternalError,
  APIError
} from "@/lib/error-handler";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    // Get session from NextAuth
    const session = await auth();

    if (!session?.user?.token) {
      return handleAuthenticationError("No authentication token");
    }

    const { tag } = await params;
    const tagId = tag;

    // Make request to the backend API
    const response = await fetch(`${API_BASE_URL}/video/tag/${tagId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return handleExternalApiError(
        "Failed to fetch videos by tag",
        response.status,
        { externalError: errorText }
      );
    }

    const data = await response.json();
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
