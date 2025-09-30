"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  ClipboardCheck,
  CheckCheck,
  Ban,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { getDashboardReportCount } from "@/lib/api";

export default function CounselingSchedulePanel() {
  const [stats, setStats] = useState([
    {
      icon: Clock,
      label: "MENUNGGU",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: CheckCheck,
      label: "SELESAI",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Ban,
      label: "DIBATALKAN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: ClipboardCheck,
      label: "DIJADWALKAN",
      value: 0,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardReportCount();
        if (response.success) {
          setStats([
            {
              icon: Clock,
              label: "MENUNGGU",
              value: response.data.menunggu,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: CheckCheck,
              label: "SELESAI",
              value: response.data.selesai,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: Ban,
              label: "DIBATALKAN",
              value: response.data.dibatalkan,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
            {
              icon: ClipboardCheck,
              label: "DIJADWALKAN",
              value: response.data.dijadwalkan,
              bgColor: "bg-indigo-200",
              textColor: "text-indigo-500",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching dashboard report count data:", error);
      }
    };

    fetchData();
  }, []);

  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3 lg:grid-cols-4" />;
}
