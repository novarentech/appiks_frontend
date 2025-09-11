"use client";

import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type SplashProps = {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  quote?: string;
  author?: string;
  duration?: number;
  showOnce?: boolean;
  onFinish?: () => void;
};

export default function SplashScreen({
  imageSrc = "/image/bgSplashScreen.webp",
  title = "Hai, Selamat Datang di Appiks!",
  subtitle = "Platform untuk Mencegah Intoleransi dan Kekerasan di Sekolah melalui Pemantauan Emosi & Edukasi Positif.",
  quote = '"Percayalah pada dirimu sendiri dan semua yang ada dalam dirimu. Ketahuilah bahwa ada sesuatu di dalam dirimu yang lebih besar daripada rintangan apa pun."',
  author = "Christian D. Larson",
  duration = 3000,
  showOnce = true,
  onFinish,
}: SplashProps) {
  const [visible, setVisible] = useState(false); 
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const img = new window.Image();
    img.src = imageSrc;
    img.onload = () => {
      setVisible(true);
    };
  }, [imageSrc]);

  useEffect(() => {
    if (!visible) return;

    if (showOnce) {
      try {
        if (sessionStorage.getItem("appiks_splash_seen") === "1") {
          setVisible(false);
          onFinish?.();
          return;
        }
      } catch {}
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, showOnce, onFinish]);

  function handleExitComplete() {
    if (showOnce) {
      try {
        sessionStorage.setItem("appiks_splash_seen", "1");
      } catch {}
    }
    onFinish?.();
  }

  const transition = shouldReduceMotion
    ? { duration: 0.1 }
    : { duration: 0.7 };

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={imageSrc} />
      </Head>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {visible && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            role="dialog"
            aria-label="Splash screen"
          >
            <div className="absolute inset-0 -z-10">
              <Image
                src={imageSrc}
                alt=""
                fill
                priority
                style={{ objectFit: "cover" }}
                aria-hidden="true"
              />
            </div>

            <div className="max-w-5xl w-full px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-semibold text-white drop-shadow-md leading-tight">
                {title}
              </h1>
              <p className="mt-4 text-sm md:text-lg text-white/90 max-w-3xl mx-auto">
                {subtitle}
              </p>

              <div className="mt-12 mx-auto max-w-3xl rounded-xl border border-slate-50 bg-white/10 p-6 md:p-8 backdrop-blur-md shadow-lg">
                <h3 className="text-lg md:text-2xl font-semibold text-white">
                  Quote of the Day
                </h3>
                <p className="mt-4 text-sm md:text-base text-white/90">{quote}</p>
                <div className="mt-4 text-sm italic text-white/80">– {author} –</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
