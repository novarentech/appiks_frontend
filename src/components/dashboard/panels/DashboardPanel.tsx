import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface StatItem {
  icon: LucideIcon | IconType;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

interface DashboardPanelProps {
  items: StatItem[];
  gridCols?: string;
}

export default function DashboardPanel({
  items,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
}: DashboardPanelProps) {
  return (
    <Card className="w-full shadow-none">
      <div className={`grid ${gridCols} divide-y md:divide-y-0 md:divide-x divide-gray-200`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="p-6 flex items-center space-x-4">
              <div className={`p-3 ${item.bgColor} rounded-full`}>
                <Icon className={`w-6 h-6 ${item.textColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className={`text-3xl font-bold ${item.textColor}`}>
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}