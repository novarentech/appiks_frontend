"use client";

import { Users } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getRoomStudentCount } from "@/lib/api";

export default function ClassPanel() {
  const [stats, setStats] = useState([
    {
      icon: FaChalkboardTeacher,
      label: "TOTAL KELAS",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Users,
      label: "TOTAL SISWA",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRoomStudentCount();
        if (response.success) {
          const { room, student } = response.data;
          setStats([
            {
              icon: FaChalkboardTeacher,
              label: "TOTAL KELAS",
              value: room,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Users,
              label: "TOTAL SISWA",
              value: student,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching room and student count:", error);
      }
    };

    fetchData();
  }, []);

  return <DashboardPanel items={stats} />;
}
