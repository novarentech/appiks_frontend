import { NextResponse } from "next/server";
import { createCSRFToken } from "@/lib/csrf";

export async function GET() {
  try {
    const csrfToken = createCSRFToken();
    
    // Set CSRF token in cookie for client-side access
    const response = NextResponse.json({
      success: true,
      message: "CSRF token generated successfully",
    });
    
    // Set HTTP-only cookie with the token
    response.cookies.set({
      name: "csrf_token",
      value: csrfToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });
    
    // Also include the token in the response body for client-side usage
    return NextResponse.json({
      success: true,
      message: "CSRF token generated successfully",
      data: {
        csrfToken,
      },
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CSRF token",
      },
      { status: 500 }
    );
  }
}