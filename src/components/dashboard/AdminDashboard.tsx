"use client";

import AdminPanel from "./panels/AdminPanel";
import NewContentCard from "../data-display/cards/NewContent";
import NewUserCard from "../data-display/cards/NewUser";

export function AdminDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Selamat Datang</h1>
        <p className="text-gray-600 mt-2">
          Kelola Akun dan Konten dengan Mudah
        </p>
      </div>

      <AdminPanel />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Konten Terbaru */}
        <NewContentCard />
        {/* Pengguna Terbaru */}
        <NewUserCard />
      </div>
    </div>
  );
}
