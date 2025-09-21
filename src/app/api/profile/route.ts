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

interface ProfileUpdateRequest {
  username: string;
  phone: string;
  password: string;
}

const handler = async (request: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.token) {
      return handleAuthenticationError("No authentication token");
    }

    const body = await request.json();

    // Validate request body
    const validatedBody = validateRequestBody<ProfileUpdateRequest>(body, {
      username: (value) => {
        if (!value || typeof value !== 'string') return "Username is required and must be a string";
        if (value.trim().length < 3) return "Username must be at least 3 characters";
        return true;
      },
      phone: (value) => {
        if (!value || typeof value !== 'string') return "Phone is required and must be a string";
        if (!/^\d+$/.test(value)) return "Phone must contain only numbers";
        return true;
      },
      password: (value) => {
        if (!value || typeof value !== 'string') return "Password is required and must be a string";
        if (value.length < 6) return "Password must be at least 6 characters";
        return true;
      },
    });

    const backendUrl = `${API_BASE_URL}/profile`;

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: validatedBody.username,
        phone: validatedBody.phone,
        password: validatedBody.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return handleExternalApiError(
        "Failed to update profile",
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
};

export const PATCH = withCSRFProtection(handler);
