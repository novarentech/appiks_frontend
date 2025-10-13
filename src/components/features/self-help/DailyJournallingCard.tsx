"use client";

import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { createDailyJournaling } from "@/lib/api";
import { toast } from "sonner";

const categories = ["Sekolah", "Rumah", "Teman", "Cinta", "Belajar", "Guru"];

const emotions = [
  { label: "Gembira", value: "gembira", emoji: "/icon/ico-happy.webp" },
  { label: "Percaya", value: "percaya", emoji: "/icon/ico-confident.webp" },
  { label: "Takut", value: "takut", emoji: "/icon/ico-scared.webp" },
  { label: "Terkejut", value: "terkejut", emoji: "/icon/ico-surprised.webp" },
  { label: "Sedih", value: "sedih", emoji: "/icon/ico-sad.webp" },
  { label: "Muak", value: "muak", emoji: "/icon/ico-nauseated.webp" },
  { label: "Marah", value: "marah", emoji: "/icon/ico-angry.webp" },
  { label: "Antisipatif", value: "antisipatif", emoji: "/icon/ico-anticipating.webp" },
];

export default function DailyJournallingCard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [story, setStory] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [thought, setThought] = useState("");
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleEmotionToggle = (value: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSave = async () => {
    try {
      const payload = {
        mind: thought,
        story,
        category: selectedCategory || "",
        emotions: selectedEmotions,
      };

      const response = await createDailyJournaling(payload);
      
      if (response.success) {
        toast.success("Journal berhasil disimpan!");
        handleGoToDashboard();
      } else {
        toast.error(response.message || "Gagal menyimpan journal");
      }
    } catch (error) {
      console.error("Error saving journal:", error);
      toast.error("Terjadi kesalahan saat menyimpan journal");
    }
  };

  return (
    <>
      <Card className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Mulai Catatan Harianmu
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Tuliskan pengalaman, emosi, dan pikiranmu di sini.
        </p>
        <div className="flex justify-center mb-8">
          <Image
            src="/image/mascot-journal.webp"
            alt="Mascot"
            width={300}
            height={244}
            priority
          />
        </div>

        {/* Kategori */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg text-gray-800 mb-1">
            Apa yang terjadi?
          </h2>
          <p className="text-gray-500 text-sm mb-3">
            Pilih kategori ceritamu hari ini
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 rounded-lg border text-sm font-medium transition-all
                  ${
                    selectedCategory === cat
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <label className="block text-gray-500 text-sm mb-1">
            Mau menambahkan cerita?
          </label>
          <Textarea
            className="min-h-40"
            placeholder="Tulis detail singkat atau hal yang ingin kamu ceritakan (opsional)."
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        {/* Emosi */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg text-gray-800 mb-1">
            Bagaimana emosi yang sedang kamu rasakan?
          </h2>
          <p className="text-gray-500 text-sm mb-3">Pilih beberapa</p>
          <div className="grid grid-cols-4 gap-3">
            {emotions.map((emo) => (
              <button
                key={emo.value}
                type="button"
                onClick={() => handleEmotionToggle(emo.value)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all
                  ${
                    selectedEmotions.includes(emo.value)
                      ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-indigo-200"
                  }`}
              >
                <Image
                  src={emo.emoji}
                  alt={emo.label}
                  width={32}
                  height={32}
                />
                <span className="text-xs font-medium mt-2">{emo.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pikiran */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg text-gray-800 mb-1">
            Apa yang sedang kamu pikirkan (Opsional)
          </h2>
          <p className="text-gray-500 text-sm mb-2">Ceritakan di bawah ini</p>
          <Textarea
            className="min-h-40"
            value={thought}
            placeholder="Aku pikir... / Aku khawatir... / Aku harap..."
            onChange={(e) => setThought(e.target.value)}
          />
        </div>
      </Card>

      {/* Tombol Simpan */}
      <div className="flex justify-end mt-7">
        <Button
          onClick={handleSave}
          disabled={
            !selectedCategory && !story && selectedEmotions.length === 0
          }
        >
          Simpan Journal
          <CheckCheck className="ml-2" />
        </Button>
      </div>
    </>
  );
}
