"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Komponen Hero untuk landing page
 * Menampilkan judul utama, deskripsi, dan tombol aksi
 */
const Hero = () => {
  return (
    <section
      className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center pt-20 pb-10 relative overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute top-40 -right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-40 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4
          }}
        />
      </div>
      
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 min-h-[60vh] lg:min-h-[70vh]">
          {/* Konten Hero */}
          <motion.div
            className="flex flex-col items-center py-10 text-center lg:items-start lg:text-left lg:py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="flex h-2 w-2 relative">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="ml-2">Platform Kesehatan Mental Terpercaya</span>
            </motion.div>
            <motion.h1
              id="hero-heading"
              className="my-6 text-pretty text-3xl font-bold sm:text-4xl lg:text-6xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Platform Kesehatan Mental untuk Siswa
            </motion.h1>
            <motion.p
              className="text-slate-600 mt-4 mb-12 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Pantau mood harianmu, dapatkan dukungan, dan jaga kesehatan
              mentalmu bersama appiks.id
            </motion.p>
            <motion.div
              className="flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="rounded-full w-full sm:w-auto font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  aria-label="Mulai menggunakan platform sekarang"
                >
                  Mulai Sekarang
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="rounded-full w-full sm:w-auto font-medium border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                  size="lg"
                  aria-label="Pelajari lebih lanjut tentang platform"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Gambar Hero */}
          <motion.div
            className="flex justify-center items-center w-full h-full relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-2xl transform scale-150"
              animate={{
                scale: [1.5, 1.6, 1.5],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                width={500}
                height={500}
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
                alt="Ilustrasi platform kesehatan mental untuk siswa"
                className="h-auto w-full max-w-[400px] sm:max-w-[500px] object-cover rounded-2xl shadow-xl relative z-10"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave separator */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <svg className="relative block w-full h-16 md:h-24 lg:h-32" preserveAspectRatio="none" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 45C1200 40 1320 40 1380 40L1440 40V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V40Z" fill="#F8FAFC"/>
        </svg>
      </motion.div>
    </section>
  );
};

export { Hero };
