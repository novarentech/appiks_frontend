"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

/**
 * Props untuk komponen Footer7
 */
interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

/**
 * Data default untuk section footer
 */
const defaultSections = [
  {
    title: "Tentang",
    links: [
      { name: "Cara Kerja", href: "#" },
      { name: "Fitur Unggulan", href: "#" },
      { name: "Kemitraan", href: "#" },
      { name: "Hubungan Kami", href: "#" },
    ],
  },
  {
    title: "Komunitas",
    links: [
      { name: "Acara", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Podcast", href: "#" },
      { name: "Undang Teman", href: "#" },
    ],
  },
  {
    title: "Media Sosial",
    links: [
      { name: "Discord", href: "#" },
      { name: "Instagram", href: "#" },
      { name: "Twitter", href: "#" },
      { name: "Facebook", href: "#" },
    ],
  },
];

/**
 * Data default untuk link media sosial
 */
const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "#", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "#", label: "LinkedIn" },
];

/**
 * Data default untuk link legal
 */
const defaultLegalLinks = [
  { name: "Syarat dan Ketentuan", href: "#" },
  { name: "Kebijakan Privasi", href: "#" },
];

/**
 * Komponen Footer7 untuk landing page
 * Menampilkan informasi logo, deskripsi, link navigasi, media sosial, dan legal
 */
const Footer7 = ({
  logo = {
    url: "/",
    src: "/logo.webp",
    alt: "logo Appiks",
    title: "Appiks",
  },
  sections = defaultSections,
  description = "Visi kami adalah memberikan kemudahan dan membantu meningkatkan kesehatan mental siswa melalui platform yang komprehensif.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 Appiks. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800 pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 relative"
      aria-label="Footer informasi situs"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-xl"
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
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-xl"
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
      
      <div className="container px-4 sm:px-2 lg:px-0 mx-auto relative z-10">
        <motion.div
          className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:text-left lg:gap-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Logo dan Deskripsi */}
          <motion.div
            className="flex w-full flex-col gap-6 lg:items-start lg:w-2/5"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center gap-3 lg:justify-start"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30 blur-md"></div>
                <Link href={logo.url} aria-label="Kembali ke beranda" className="relative z-10">
                  <Image
                    width={40}
                    height={40}
                    src={logo.src}
                    alt={logo.alt}
                    title={logo.title}
                    className="h-10"
                  />
                </Link>
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{logo.title}</h2>
            </motion.div>
            <motion.p
              className="text-slate-600 max-w-md text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {description}
            </motion.p>
            
            {/* Media Sosial */}
            <motion.ul
              className="text-slate-600 flex items-center gap-4 sm:gap-6"
              aria-label="Media sosial"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, idx) => (
                <motion.li
                  key={idx}
                  className="hover:text-blue-600 font-medium transition-colors"
                  whileHover={{ y: -5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={social.href}
                    aria-label={social.label}
                    className=" p-2 transition-all duration-300 s"
                  >
                    {social.icon}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          
          {/* Navigasi Section */}
          <motion.div
            className="grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-16 lg:w-3/5"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {sections.map((section, sectionIdx) => (
              <motion.nav
                key={sectionIdx}
                aria-labelledby={`footer-section-${sectionIdx}`}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * sectionIdx + 0.5 }}
                viewport={{ once: true }}
              >
                <motion.h3
                  id={`footer-section-${sectionIdx}`}
                  className="mb-4 font-bold text-lg text-slate-800"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {section.title}
                </motion.h3>
                <motion.ul className="text-slate-600 space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <motion.li
                      key={linkIdx}
                      className="hover:text-blue-600 font-medium transition-colors"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={link.href}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 hover:bg-blue-100/50 transition-all duration-300 inline-block"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.nav>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Copyright dan Legal Links */}
        <motion.div
          className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-200 py-6 text-xs font-medium md:flex-row md:items-center md:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p className="order-2 lg:order-1 text-slate-500">{copyright}</motion.p>
          <motion.ul
            className="order-1 flex flex-col gap-4 md:order-2 md:flex-row md:gap-6"
            aria-label="Link legal"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            {legalLinks.map((link, idx) => (
              <motion.li
                key={idx}
                className="hover:text-blue-600 transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href={link.href}
                  className="text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5 hover:bg-blue-100/50 transition-all duration-300 inline-block"
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export { Footer7 };
