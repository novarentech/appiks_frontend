"use client";

import { motion } from "framer-motion";
import { InsecureSurveyResultData } from "@/types/survey";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileDisplay } from "./ProfileDisplay";
import { InfoCard } from "./InfoCard";
import { NotesCard } from "./NotesCard";
import { getArchetypeImage, getLearningModeImage } from "@/lib/archtype-mapping";

interface InsecureResultCardProps {
  resultData: InsecureSurveyResultData;
  userName: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function InsecureResultCard({
  resultData,
  userName,
}: InsecureResultCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      whileHover={{ y: -5 }}
    >
      <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full max-w-2xl lg:max-w-4xl mx-auto min-h-[400px] sm:min-h-[500px] mt-10 sm:mt-20 border-0">
        <CardHeader className="p-4 sm:p-6 text-center">
          <motion.h2
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Hai {userName}, Selamat!
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl font-bold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Ekspedisimu berhasil mengungkap PROFIL PAHLAWAN mu:
          </motion.p>
          <motion.p
            className="text-sm sm:text-base"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Berdasarkan jawabanmu, kami melihat profil seorang:
          </motion.p>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <ProfileDisplay
            imageSrc={getArchetypeImage(resultData.archtype.type.main)}
            imageAlt={resultData.archtype.type.main}
            name={resultData.archtype.type.main}
            subtitle={`${resultData.archtype.character}`}
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Archetype Info */}
            <InfoCard
              title="Tipe Utama"
              content={resultData.archtype.type.main}
              color="blue-600"
              className="lg:col-span-1"
            />

            <InfoCard
              title="Tipe Sekunder"
              content={resultData.archtype.type.secondary}
              color="purple-600"
              className="lg:col-span-1"
            />

            <InfoCard
              title="Kebiasaan"
              content={resultData.archtype.habits}
              color="green-600"
              className="lg:col-span-1"
            />

            {/* Learning Info */}
            <InfoCard
              title="Mode Belajar"
              content={resultData.learn.mode}
              color="yellow-500"
              className="lg:col-span-1"
              showImage
              imageSrc={getLearningModeImage(resultData.learn.mode)}
              imageAlt={`Learning Mode: ${resultData.learn.mode}`}
              imagePosition="bottom"
            />

            <InfoCard
              title="Gaya Belajar"
              content={resultData.learn.style}
              color="sky-900"
              className="lg:col-span-2"
              showImage
              imagePosition="bottom"
              imageSrc="/image/survey/flame.webp"
              imageAlt="Learning Style Icon"
            />

            {/* Power and Fuel */}
            <InfoCard
              title="Kekuatan Super"
              content={resultData.archtype.power}
              color="red-600"
              className="lg:col-span-2"
            />

            <InfoCard
              title="Bahan Bakar"
              content={resultData.fuel}
              color="orange-600"
              className="lg:col-span-1"
            />

            {/* Description */}
            <NotesCard content={resultData.archtype.description} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
