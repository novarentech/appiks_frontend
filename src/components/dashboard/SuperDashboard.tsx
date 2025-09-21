"use client";

import SchoolAndClassChart from "../data-display/charts/SchoolAndClaass";
import TuPanel from "./panels/TuPanel";


export function SuperDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">Kendali Penuh Appiks</p>
      </div>
      <TuPanel />
      <div className="grid gap-6 lg:grid-cols-2">
        <SchoolAndClassChart />
      </div>
    </div>
  );
}
