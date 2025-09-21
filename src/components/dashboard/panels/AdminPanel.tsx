import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function AdminPanel() {
  const stats = [
    {
      icon: Users,
      label: "TOTAL PENGGUNA",
      value: 32,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ClipboardList,
      label: "PENGGUNA AKTIF",
      value: 25,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: ThumbsUp,
      label: "TOTAL KONTEN",
      value: 20,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      label: "KONTEN HARI INI",
      value: 5,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return <DashboardPanel items={stats} />;
}
