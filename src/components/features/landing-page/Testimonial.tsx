
"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";

/**
 * Data testimonial dari pengguna Appiks
 */
const cardItems = [
  {
    name: "Doni Wicaksana",
    role: "Siswa",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    testimonial:
      "Awalnya aku jarang memperhatikan mood sendiri, tapi sejak pakai Appiks, aku jadi lebih peka sama perasaanku. Fitur catat mood hariannya gampang banget dipakai, dan tips self-help-nya bener-bener membantu pas lagi down.",
  },
  {
    name: "Adi Wirawan",
    role: "Guru BK",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    testimonial:
      "Dengan Appiks, saya mendapat data yang jelas dan real-time tentang kondisi emosional siswa. Ini sangat membantu dalam menentukan prioritas tindak lanjut dan memberikan bimbingan yang tepat.",
  },
  {
    name: "Grace Wijaya",
    role: "Wali Kelas",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    testimonial:
      "Appiks memudahkan saya memantau kondisi siswa tanpa harus menunggu sampai ada masalah besar. Saya bisa tahu siapa yang sedang butuh perhatian lebih dan menghubungi mereka lebih cepat.",
  },
];

/**
 * Komponen Testimonial untuk menampilkan pengalaman pengguna Appiks
 * Menampilkan grid testimonial dengan avatar, nama, peran, dan kutipan
 */
const Testimonial = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-24 sm:py-36 lg:py-48 bg-gradient-to-br from-blue-50 to-indigo-50 relative"
      aria-labelledby="testimonial-heading"
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
            id="testimonial-heading"
            className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Bagaimana Appiks Membantu Mereka?
          </motion.h2>
          <motion.p
            className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Ribuan Pengguna Telah Memulai Perjalanan Self-Awareness Bersama Kami
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 xl:grid-cols-3">
          {cardItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              <Card className="h-full flex flex-col bg-white shadow-md transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-200 group overflow-hidden">
                {/* Quote decoration */}
                <motion.div
                  className="absolute top-4 right-4 text-blue-200 opacity-50 text-4xl group-hover:text-blue-300 transition-colors duration-300"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.5
                  }}
                >
                  &ldquo;
                </motion.div>
                
                <CardFooter className="pt-6 pb-4 relative z-10">
                  <div className="flex gap-4 items-center">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 scale-110"></div>
                      <Avatar className="size-14 rounded-full ring-2 ring-white shadow-md relative z-10">
                        <AvatarImage src={item.avatar} alt={item.name} />
                      </Avatar>
                    </motion.div>
                    <div>
                      <motion.p
                        className="font-medium text-base sm:text-lg text-slate-800 group-hover:text-blue-600 transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.name}
                      </motion.p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </CardFooter>
                <CardContent className="px-6 pb-6 leading-7 text-slate-600 flex-1 relative z-10">
                  <blockquote
                    className="italic text-sm sm:text-base mt-2 relative"
                    cite={`Testimonial dari ${item.name}`}
                  >
                    <div className="absolute -left-2 top-0 text-blue-200 opacity-50 text-2xl">&ldquo;</div>
                    <div className="absolute -right-2 bottom-0 text-blue-200 opacity-50 text-2xl">&rdquo;</div>
                    <p className="relative z-10">&ldquo;{item.testimonial}&rdquo;</p>
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export { Testimonial };
