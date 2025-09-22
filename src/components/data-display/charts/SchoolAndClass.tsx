"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

// Data untuk chart Sekolah & Kelas sepanjang tahun 2025
const sekolahKelasData = [
  { month: "Jan", Sekolah: 15, Kelas: 10 },
  { month: "Feb", Sekolah: 25, Kelas: 18 },
  { month: "Mar", Sekolah: 40, Kelas: 55 },
  { month: "Apr", Sekolah: 55, Kelas: 45 },
  { month: "May", Sekolah: 85, Kelas: 110 },
  { month: "Jun", Sekolah: 75, Kelas: 85 },
  { month: "Jul", Sekolah: 70, Kelas: 90 },
  { month: "Aug", Sekolah: 95, Kelas: 70 },
  { month: "Sep", Sekolah: 65, Kelas: 50 },
  { month: "Oct", Sekolah: 50, Kelas: 40 },
  { month: "Nov", Sekolah: 45, Kelas: 35 },
  { month: "Dec", Sekolah: 35, Kelas: 25 },
];

// Types
interface SekolahKelasData {
  month: string;
  Sekolah: number;
  Kelas: number;
  details?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: SekolahKelasData;
  }>;
  label?: string;
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const sekolahData = payload.find((p) => p.dataKey === "Sekolah");
    const kelasData = payload.find((p) => p.dataKey === "Kelas");

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label}`}</p>
        {sekolahData && (
          <p className="text-indigo-600">{`Sekolah: ${sekolahData.value}`}</p>
        )}
        {kelasData && (
          <p className="text-teal-600">{`Kelas: ${kelasData.value}`}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function SchoolAndClassChart() {
  const [selectedPoint, setSelectedPoint] = useState<SekolahKelasData | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  return (
    <>
      {/* Chart Laporan Sekolah & Kelas 2025 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Pertumbuhan Sekolah dan Kelas 2025
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sekolahKelasData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={[0, 200]}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="linear"
                  dataKey="Sekolah"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{
                    fill: "#6366F1",
                    strokeWidth: 2,
                    r: 3,
                    cursor: "pointer",
                  }}
                  activeDot={{ r: 5, stroke: "#6366F1", strokeWidth: 2 }}
                />
                <Line
                  type="linear"
                  dataKey="Kelas"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{
                    fill: "#10B981",
                    strokeWidth: 2,
                    r: 3,
                    cursor: "pointer",
                  }}
                  activeDot={{ r: 5, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detail Information when point is clicked */}
          {selectedPoint && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Detail {selectedPoint.month}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-sm">
                      <span className="text-indigo-600">
                        Sekolah: {selectedPoint.Sekolah}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">
                        Kelas: {selectedPoint.Kelas}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
