"use client";

import { motion } from "framer-motion";

/**
 * Props untuk komponen Stats
 */
interface StatsProps {
  heading?: string;
  description?: string;
  link?: {
    text: string;
    url: string;
  };
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

/**
 * Komponen Stats untuk menampilkan statistik dampak positif Appiks
 * Menampilkan grid statistik dengan nilai dan label
 */
const Stats = ({
  heading = "Dampak Positif",
  description = "Bersama appiks.id, mari ciptakan lingkungan yang lebih sehat untuk semua siswa",
  stats = [
    {
      id: "stat-1",
      value: "95%",
      label: "Siswa merasa lebih baik",
    },
    {
      id: "stat-2",
      value: "92%",
      label: "Berkurangnya kasus bullying",
    },
    {
      id: "stat-3",
      value: "89%",
      label: "Peningkatan awareness",
    },
    {
      id: "stat-4",
      value: "1000+",
      label: "Siswa terdaftar",
    },
  ],
}: StatsProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full py-32 sm:py-40 lg:py-52 bg-gradient-to-br from-blue-50 to-indigo-50 relative"
      aria-labelledby="stats-heading"
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
            id="stats-heading"
            className="text-2xl sm:text-3xl mb-4 sm:mb-8 lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {heading}
          </motion.h2>
          <motion.p
            className="mb-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {description}
          </motion.p>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </motion.div>
        
        {/* Stats Grid */}
        <div className="mt-10 sm:mt-14 lg:mt-20 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.article
              key={stat.id}
              className="flex flex-col gap-3 justify-center items-center py-8 px-4 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl border border-slate-100 hover:border-blue-200 group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index + 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Counter with animation */}
              <motion.div
                className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2 relative z-10"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.6 }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.div>
              <motion.p
                className="text-base sm:text-lg text-slate-600 text-center font-medium relative z-10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index + 0.7 }}
                viewport={{ once: true }}
              >
                {stat.label}
              </motion.p>
              
              {/* Icon decoration */}
              <motion.div
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
              </motion.div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export { Stats };
