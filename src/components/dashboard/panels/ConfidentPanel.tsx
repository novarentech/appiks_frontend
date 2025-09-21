import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function ConfidentPanel() {
  const stats = [
    {
      icon: Users,
      label: "BELUM DIBALAS",
      value: 20,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ClipboardList,
      label: "DIBALAS",
      value: 5,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: ThumbsUp,
      label: "SELESAI",
      value: 10,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      label: "TOTAL",
      value: 40,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return <DashboardPanel items={stats} />;
}
