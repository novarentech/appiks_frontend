import {
  Clock,
  CheckCircle,
  Calendar,
  ClipboardCheck,
  XCircle,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function CounselingSchedulePanel() {
  const stats = [
    {
      icon: Clock,
      label: "MENUNGGU",
      value: 1,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-600"
    },
    {
      icon: CheckCircle,
      label: "DISETUJUI",
      value: 1,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: Calendar,
      label: "DIJADWAL ULANG",
      value: 1,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    },
    {
      icon: ClipboardCheck,
      label: "SELESAI",
      value: 1,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: XCircle,
      label: "DIBATALKAN",
      value: 1,
      bgColor: "bg-red-100",
      textColor: "text-red-600"
    }
  ];

  return <DashboardPanel items={stats} gridCols="grid-cols-1 md:grid-cols-3 lg:grid-cols-5" />;
}
