import { NextResponse } from "next/server";
import { createCSRFToken } from "@/lib/csrf";

export async function GET() {
  try {
    const csrfToken = createCSRFToken();
    
    // Create response with CSRF token in body
    const response = NextResponse.json({
      success: true,
      message: "CSRF token generated successfully",
      data: {
        csrfToken,
      },
    });
    
    // Set HTTP-only cookie with the token
    response.cookies.set({
      name: "csrf_token",
      value: csrfToken,
      httpOnly: false, // Changed to false so JavaScript can access it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to lax for better compatibility
      maxAge: 3600, // 1 hour
      path: "/",
    });
    
    return response;
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