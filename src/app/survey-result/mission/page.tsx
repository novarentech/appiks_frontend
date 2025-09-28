"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Confetti, type ConfettiRef } from "@/components/utils/magicui/Confetti";
import { SurveyResultData, isSecureResult, isInsecureResult } from "@/types/survey";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

// Types
interface MissionTask {
  title: string;
  text: string;
}

interface MissionData {
  first: MissionTask;
  second: MissionTask;
}

export default function SurveyResultMissionPage() {
  // State and hooks
  const router = useRouter();
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const confettiRef = useRef<ConfettiRef>(null);
  const { user } = useAuth();

  // Confetti animation
  const fireSideCannons = useCallback(() => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confettiRef.current?.fire({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      confettiRef.current?.fire({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  // Navigation handlers
  const handleBackToResults = useCallback(() => {
    router.push("/survey-result");
  }, [router]);

  const handleBackToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // Load mission data
  useEffect(() => {
    const storedResult = sessionStorage.getItem("surveyResult");
    if (!storedResult) {
      router.push("/survey-result");
      setIsLoading(false);
      return;
    }

    try {
      const data: SurveyResultData = JSON.parse(storedResult);
      
      let mission: MissionData | null = null;
      
      if (isSecureResult(data)) {
        mission = {
          first: {
            title: data.mission.carier,
            text: data.mission.practice
          },
          second: {
            title: "Tantangan Tambahan",
            text: "Terapkan apa yang telah kamu pelajari dalam kehidupan sehari-hari dan amati perubahannya!"
          }
        };
      } else if (isInsecureResult(data)) {
        mission = {
          first: {
            title: data.mission.first.title,
            text: data.mission.first.text
          },
          second: {
            title: data.mission.second.title,
            text: data.mission.second.text
          }
        };
      }

      setMissionData(mission);
      setTimeout(() => fireSideCannons(), 1000);
    } catch (error) {
      console.error("Error parsing survey result:", error);
      router.push("/survey-result");
    } finally {
      setIsLoading(false);
    }
  }, [router, fireSideCannons]);

  // Get user name
  const getUserName = () => user?.name || user?.username || "Username";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // No data state
  if (!missionData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Data misi tidak ditemukan</p>
            <Button onClick={handleBackToResults} className="w-full">
              Kembali ke Hasil Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mission card component
  const MissionCard = ({ 
    mission, 
    delay = 0,
    rotateDirection = 1 
  }: { 
    mission: MissionTask; 
    delay?: number;
    rotateDirection?: number;
  }) => (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        rotateX: 5 * rotateDirection
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 400,
        delay
      }}
      className="h-full"
    >
      <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden h-full pt-0">
        <CardHeader className="relative bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white p-8 pb-12 min-h-44">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full blur-lg"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              {mission.title}
            </h2>
            <div className="w-12 h-1 bg-white/30 rounded-full mt-4"></div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 pt-16 -mt-8 relative">
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-indigo-200 to-indigo-300 rounded-full"></div>
          
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-medium">
            {mission.text}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen py-4 sm:py-8 px-4 bg-gradient-to-br from-indigo-50 via-white to-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Confetti
        ref={confettiRef}
        className="fixed left-0 top-0 w-full h-full pointer-events-none z-50"
        manualstart={true}
      />

      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Misi Eksplorasi Anda
        </h1>
        <p className="text-lg text-gray-600">
          Hai {getUserName()}! Ini adalah tantangan spesial berdasarkan hasil survey mu
        </p>
      </motion.div>

      {/* Mission Cards */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <MissionCard mission={missionData.first} />
        <MissionCard mission={missionData.second} delay={0.1} rotateDirection={-1} />
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <Button
          onClick={handleBackToDashboard}
        >
          Selesai
          <Check className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
