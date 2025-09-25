"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Upload, X } from "lucide-react";
import { ContentItem } from "@/components/data-display/tables/ContentManagementTable";
import { Tag } from "@/types/api";
import { createVideo } from "@/lib/api";
import { CreateVideoRequest } from "@/types/api";
import { toast } from "sonner";

interface CreateVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: Tag[];
  tagsLoading: boolean;
  onSuccess: (video: ContentItem) => void;
}

export function CreateVideoDialog({
  open,
  onOpenChange,
  tags,
  tagsLoading,
  onSuccess,
}: CreateVideoDialogProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const extractVideoId = (url: string): string | null => {
    // Extract YouTube video ID from URL
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    if (!youtubeUrl.trim() || selectedTags.length === 0) {
      toast.error("Mohon lengkapi URL YouTube dan pilih minimal satu tag");
      return;
    }

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(youtubeUrl)) {
      toast.error("Mohon masukkan URL YouTube yang valid");
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      toast.error("Tidak dapat mengekstrak ID video dari URL YouTube");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert tag titles to tag IDs
      const tagIds = tags
        .filter((tag) => selectedTags.includes(tag.title))
        .map((tag) => tag.id);

      const videoData: CreateVideoRequest = {
        video_id: videoId,
        tags: tagIds,
      };

      const response = await createVideo(videoData);

      const newVideo: ContentItem = {
        id: response.data.id.toString(),
        title: response.data.title || "Video Title",
        type: "Video",
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        url: youtubeUrl.trim(),
        category: selectedTags[0] || "Uncategorized",
        ids: response.data.id.toString(),
        created_at: response.data.created_at,
      };

      onSuccess(newVideo);
      toast.success("Video berhasil dibuat!");

      // Reset form
      setYoutubeUrl("");
      setSelectedTags([]);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error creating video:", error);
      toast.error("Gagal membuat video. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setYoutubeUrl("");
    setSelectedTags([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Play className="h-6 w-6 text-green-600" />
            Buat Video
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* YouTube URL Input */}
          <div>
            <Label htmlFor="youtube-url" className="text-sm font-medium">
              URL Youtube <span className="text-red-500">*</span>
            </Label>
            <Input
              id="youtube-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://"
              className="mt-1 bg-gray-100"
            />
          </div>

          {/* Tags Section */}
          <div>
            <Label className="text-sm font-medium">
              Tags <span className="text-red-500">*</span>
            </Label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-600 text-white px-3 py-1 hover:bg-blue-700"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-blue-200 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Tags */}
            <div className="border rounded-lg p-3 bg-gray-50 min-h-[60px] mt-3">
              {tagsLoading ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-10">
                  Memuat tag...
                </div>
              ) : tags.length === 0 ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center h-10">
                  Tidak ada tag tersedia
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={
                        selectedTags.includes(tag.title) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTagToggle(tag.title)}
                      className={
                        selectedTags.includes(tag.title)
                          ? "bg-blue-600 text-white"
                          : "border-blue-300 text-blue-600 hover:bg-blue-50"
                      }
                    >
                      {tag.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting || !youtubeUrl.trim() || selectedTags.length === 0
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Unggah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
