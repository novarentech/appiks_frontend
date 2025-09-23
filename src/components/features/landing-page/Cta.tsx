"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";

/**
 * Komponen Call to Action (CTA) untuk landing page
 * Menampilkan ajakan kepada pengguna untuk memulai perjalanan kesehatan mental
 */
const Cta = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-24 sm:py-36 lg:py-48 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <div className="container px-4 sm:px-8 lg:px-16 mx-auto relative z-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Gambar CTA */}
          <motion.div
            className="flex justify-center items-center w-full h-full relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
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
                alt="Ilustrasi kesehatan mental"
                className="h-auto w-full max-w-[400px] sm:max-w-[500px] object-cover rounded-2xl shadow-xl relative z-10"
                priority
              />
            </motion.div>
          </motion.div>
          
          {/* Konten CTA */}
          <motion.div
            className="flex flex-col items-center py-10 text-center md:items-start md:text-left md:py-20"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.h1
              id="cta-heading"
              className="mt-6 mb-8 text-pretty text-3xl sm:text-4xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
            >
              Siap Memulai Perjalanan Kesehatan Mentalmu?
            </motion.h1>
            <motion.p
              className="text-muted-foreground mb-10 max-w-xl text-base sm:text-lg lg:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Kenali mood-mu, ceritakan jika ada yang mengganggu, dan temukan
              dukungan yang kamu butuhkan di sini.
            </motion.p>
            <motion.div
              className="flex w-full flex-col justify-center gap-4 sm:flex-row md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="rounded-full w-full sm:w-auto font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                  aria-label="Mulai perjalanan kesehatan mental sekarang"
                >
                  Mulai Sekarang
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export { Cta };
