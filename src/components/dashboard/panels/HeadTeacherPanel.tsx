"use client";

import { Users, User, UserStar } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import DashboardPanel from "./DashboardPanel";
import { useEffect, useState } from "react";
import { getDashboardHeadTeacher } from "@/lib/api";

export default function HeadTeacherPanel() {
  const [stats, setStats] = useState([
    {
      icon: Users,
      label: "TOTAL SISWA",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: User,
      label: "TOTAL WALI",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: User,
      label: "TOTAL BK",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: FaChalkboardTeacher,
      label: "TOTAL KELAS",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchHeadTeacherData = async () => {
      try {
        const response = await getDashboardHeadTeacher();
        if (response.success) {
          const { student_count, teacher_count, counselor_count, room_count } =
            response.data;

          setStats([
            {
              icon: Users,
              label: "TOTAL SISWA",
              value: student_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: User,
              label: "TOTAL WALI",
              value: teacher_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: User,
              label: "TOTAL BK",
              value: counselor_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: FaChalkboardTeacher,
              label: "TOTAL KELAS",
              value: room_count,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch head teacher dashboard data:", error);
      }
    };

    fetchHeadTeacherData();
  }, []);

  return <DashboardPanel items={stats} />;
}
