import { Users, ClipboardList, ThumbsUp, AlertTriangle } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

export default function CouncelorPanel() {
  const stats = [
    {
      icon: Users,
      label: "JUMLAH SISWA",
      value: 150,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: ClipboardList,
      label: "AJUAN KONSELING",
      value: 5,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: ThumbsUp,
      label: "JADWAL KONSELING",
      value: 10,
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      icon: AlertTriangle,
      label: "CURHATAN MASUK",
      value: 5,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return <DashboardPanel items={stats} />;
}
