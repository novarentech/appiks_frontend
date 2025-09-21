import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function ContentManagementPanel() {
  const stats = [
    {
      icon: Users,
      label: "KONTEN HARI INI",
      value: 150,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ClipboardList,
      label: "TOTAL KONTEN",
      value: 5,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: ThumbsUp,
      label: "TOTAL KONTEN ARTIKEL",
      value: 10,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      label: "TOTAL KONTEN VIDEO",
      value: 5,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return <DashboardPanel items={stats} />;
}
