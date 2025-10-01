"use client";

import { SurveyWalkthrough } from "@/components/features/survey/SurveyWalkthrough";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function SurveyWalkthroughPage() {
  return (
    <RoleGuard permissionType="student-only">
      <SurveyWalkthroughPageContent />
    </RoleGuard>
  );
}

function SurveyWalkthroughPageContent() {
  const router = useRouter();
  const [surveyType, setSurveyType] = useState<"secure" | "insecure">("secure");

  // Get survey type from sessionStorage based on isSafe value
  useEffect(() => {
    try {
      const isSafeStr = sessionStorage.getItem("mood_is_safe");
      if (isSafeStr !== null) {
        const isSafe = JSON.parse(isSafeStr);
        setSurveyType(isSafe ? "secure" : "insecure");
      }
    } catch (error) {
      console.error("Failed to parse isSafe from sessionStorage:", error);
      // Default to secure if parsing fails
      setSurveyType("secure");
    }
  }, []);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-8 ">
        <Button
          variant="ghost"
          className="p-0 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent group"
          onClick={handleGoToDashboard}
        >
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Ke Halaman Dashboard
        </Button>
      </div>
      <div className="max-w-2xl lg:max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {surveyType === "secure" ? "Navigator Masa Depan" : "Ekspedisi Menemu Jati Diri"}
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            {surveyType === "secure"
              ? "Respons mu menunjukkan eksplorasi karier yang sehat dan perencanaan masa depan yang positif."
              : "Respons mu menunjukkan eksplorasi karier yang sehat dan perencanaan masa depan yang positif."}
          </p>
        </div>
      </div>
      <div>
        <SurveyWalkthrough />
      </div>
    </div>
  );
}
