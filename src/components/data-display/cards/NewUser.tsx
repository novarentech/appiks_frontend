"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardLatestUser } from "@/lib/api";

interface UserItem {
  name: string;
  phone: string;
  username: string;
  identifier: string;
  verified: boolean;
  role: string;
  created_at: string;
}

export default function NewUserCard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestUsers = async () => {
      try {
        const response = await getDashboardLatestUser();
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      student: "bg-yellow-100 text-yellow-700 border-yellow-300",
      teacher: "bg-purple-100 text-purple-700 border-purple-300",
      counselor: "bg-blue-100 text-blue-700 border-blue-300",
      admin: "bg-pink-100 text-pink-700 border-pink-300",
      super: "bg-red-100 text-red-700 border-red-300",
      headteacher: "bg-green-100 text-green-700 border-green-300",
    };
    return variants[role as keyof typeof variants] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: "Siswa",
      teacher: "Guru Wali",
      counselor: "Guru BK",
      admin: "Admin TU",
      super: "Super Admin",
      headteacher: "Kepala Sekolah",
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Pengguna Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Pengguna Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada pengguna terbaru</p>
        ) : (
          users.map((user, index) => (
            <div key={index} className="border-l-4 border-cyan-500 pl-4 py-2">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">{user.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${getRoleBadge(user.role)}`}
                >
                  {getRoleLabel(user.role)}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
