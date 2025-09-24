import { Users } from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function ClassPanel() {
  const stats = [
    {
      icon: FaChalkboardTeacher,
      label: "TOTAL KELAS",
      value: 150,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
    {
      icon: Users,
      label: "TOTAL SISWA",
      value: 150,
      bgColor: "bg-indigo-200",
      textColor: "text-indigo-500",
    },
  ];

  return <DashboardPanel items={stats} />;
}
