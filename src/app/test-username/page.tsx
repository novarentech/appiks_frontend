"use client";

import { useState } from "react";
import { UsernameInput } from "@/components/ui/username-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestUsernamePage() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted username:", username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Username Checker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <UsernameInput
              value={username}
              onChange={setUsername}
              label="Test Username"
              placeholder="Coba masukkan username"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!username.trim()}
            >
              Test Submit
            </Button>

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                <strong>Current value:</strong> {username || "Empty"}
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
