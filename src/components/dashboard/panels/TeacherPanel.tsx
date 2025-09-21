import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function TeacherPanel() {
  const stats = [
    {
      icon: Users,
      label: "JUMLAH SISWA DIAMPU",
      value: 32,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ClipboardList,
      label: "LAPORAN MOOD HARI INI",
      value: 25,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: ThumbsUp,
      label: "MOOD AMAN",
      value: 20,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      label: "MOOD TIDAK AMAN",
      value: 5,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return <DashboardPanel items={stats} />;
}
