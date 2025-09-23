"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardLatestContent } from "@/lib/api";

interface ContentItem {
  id: number;
  title: string;
  created_at: string;
  type: "video" | "article" | "quote";
}

export default function NewContentCard() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestContent = async () => {
      try {
        const response = await getDashboardLatestContent();
        if (response.success) {
          setContent(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestContent();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Konten Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Konten Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {content.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada konten terbaru</p>
        ) : (
          content.map((item) => (
            <div
              key={item.id}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <h3 className="font-medium text-sm leading-tight mb-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={item.type === "video" ? "default" : "secondary"}
                  className={`text-xs ${
                    item.type === "video"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : item.type === "article"
                      ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  {item.type === "video" ? (
                    <>
                      <Video className="w-3 h-3 mr-1" />
                      Video
                    </>
                  ) : item.type === "article" ? (
                    <>
                      <FileText className="w-3 h-3 mr-1" />
                      Artikel
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3 mr-1" />
                      Quote
                    </>
                  )}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(item.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
