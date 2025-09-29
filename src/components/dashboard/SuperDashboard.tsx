"use client";

import TuPanel from "./panels/TuPanel";
import AverageStudentMood from "../data-display/charts/AverageStudentMood";

export function SuperDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">Kendali Penuh Appiks</p>
      </div>
      <TuPanel />
      <AverageStudentMood />
    </div>
  );
}
