import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { API_BASE_URL } from "@/lib/config";
import {
  handleAuthenticationError,
  handleExternalApiError,
  handleInternalError,
  APIError
} from "@/lib/error-handler";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ month: string }> }
) {
  try {
    const { month } = await params;

    // Get session from NextAuth
    const session = await auth();

    if (!session?.user?.token) {
      return handleAuthenticationError("No authentication token");
    }

    console.log(
      "🔄 Proxying mood record request with token:",
      session.user.token.substring(0, 10) + "..."
    );

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/mood_record/recap/${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
      },
      cache: "no-store",
    });

    console.log("📥 Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return handleExternalApiError(
        `Backend error: ${response.status} ${response.statusText}`,
        response.status,
        { externalError: errorText }
      );
    }

    const data = await response.json();
    console.log("✅ Mood record response:", data);

    return NextResponse.json(
        data,
        { headers: { "Cache-Control": "public, max-age=120" } }
    );
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
