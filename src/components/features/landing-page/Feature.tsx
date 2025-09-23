"use client";

import { Timer, Zap, ZoomIn, BookOpen, BarChart3, Heart } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Data fitur-fitur unggulan dari Appiks
 * Setiap fitur memiliki ikon, judul, dan deskripsi
 */
const features = [
  {
    icon: <Timer className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Pantau Mood Harian",
    description:
      "Catat dan pantau perasaanmu setiap hari dengan mudah. Dapatkan insight tentang pola emosionalmu.",
  },
  {
    icon: <Zap className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Self Help",
    description:
      "Akses tips dan teknik mengelola emosi, latihan pernapasan, dan panduan anger management.",
  },
  {
    icon: <ZoomIn className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Lapor Masalah",
    description:
      "Laporkan masalah bullying atau kekerasan dengan aman dan mendapat dukungan yang tepat.",
  },
  {
    icon: <BookOpen className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Konten Edukasi",
    description:
      "Pelajari tentang kesehatan mental, anti-bullying, dan toleransi melalui konten yang menarik.",
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Rekap Mood",
    description:
      "Lihat progress dan perkembangan mood mingguan/bulanan dalam bentuk grafik yang mudah dipahami.",
  },
  {
    icon: <Heart className="w-7 h-7 text-primary" aria-hidden="true" />,
    title: "Motivasi Harian",
    description:
      "Dapatkan kata-kata motivasi dan quote inspiratif setiap hari untuk menjaga semangat.",
  },
];

/**
 * Komponen Fitur untuk menampilkan fitur-fitur unggulan Appiks
 * Menampilkan grid fitur dengan ikon, judul, dan deskripsi
 */
const Feature = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full bg-gradient-to-b from-slate-50 to-slate-100 py-24 sm:py-32 lg:py-40 relative"
      aria-labelledby="features-heading"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-100 rounded-full opacity-30 blur-xl"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.h2
            id="features-heading"
            className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Fitur Unggulan
          </motion.h2>
          <motion.p
            className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Platform komprehensif untuk mendukung kesehatan mental siswa dengan
            berbagai fitur yang mudah digunakan
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </motion.div>
        
        {/* Features Grid */}
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.article
              key={feature.title}
              className="rounded-xl bg-white p-6 flex flex-col md:flex-row gap-6 items-center md:items-start transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-200 group"
              aria-labelledby={`feature-title-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * idx + 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Feature Icon */}
              <motion.span
                className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-purple-50 w-16 h-16 mb-4 md:mb-0 shadow-md group-hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {feature.icon}
              </motion.span>
              
              {/* Feature Content */}
              <div className="flex-1 text-center md:text-left">
                <motion.h3
                  className="mb-2 text-lg sm:text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300"
                  id={`feature-title-${idx}`}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="leading-7 text-muted-foreground text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export { Feature };
