"use client";

import { VideoRecommendations } from "@/components/features/videos/VideoRecomendation";
import { RoleGuard } from "@/components/auth/guards/RoleGuard";

export default function VideoPage() {
  return (
    <RoleGuard permissionType="video-player">
      <VideoPageContent />
    </RoleGuard>
  );
}

function VideoPageContent() {
  return (
    <div className="min-h-screen max-w-6xl container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
      <VideoRecommendations />
    </div>
  );
}
