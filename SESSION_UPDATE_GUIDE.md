# Session Update Implementation Guide

## 🔄 Update Session Setelah Profile Update

Implementasi untuk mengupdate session NextAuth setelah berhasil update profile user.

## 📋 Response Update Profile

Response dari API update profile:
```json
{
  "success": true,
  "message": "Success update user profile",
  "data": {
    "name": "Paramita Maria Safitri S.I.Kom",
    "phone": "083123124123", 
    "username": "kasnd",
    "identifier": "0000000000",
    "verified": true,
    "role": "student"
  }
}
```

## 🔧 Implementation

### 1. Hook `useProfileUpdate`

File: `src/hooks/useProfileUpdate.ts`

```typescript
const updateProfile = async (profileData: UpdateProfileData): Promise<boolean> => {
  // ... API call logic

  if (data.success) {
    // Update session dengan data baru dari response
    console.log("🔄 Updating session with new profile data:", data.data);
    
    await update({
      ...session,
      user: {
        ...session.user,
        username: data.data.username,
        phone: data.data.phone,
        name: data.data.name,
        verified: data.data.verified,
      },
    });
    
    console.log("✅ Session updated successfully");
    return true;
  }
};
```

### 2. NextAuth Configuration

File: `src/lib/nextauth.ts`

```typescript
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // Handle initial login
    if (user) {
      const customUser = user as CustomUser;
      token.id = customUser.id;
      token.username = customUser.username;
      token.verified = customUser.verified;
      token.token = customUser.token;
      token.expiresIn = customUser.expiresIn;
      token.name = customUser.name;
      token.phone = customUser.phone;
    }

    // Handle session update (ketika update() dipanggil dari client)
    if (trigger === "update" && session) {
      console.log("🔄 JWT Callback - Session update triggered:", session);
      
      // Update token dengan data session baru
      if (session.user) {
        token.username = session.user.username || token.username;
        token.phone = session.user.phone || token.phone;
        token.name = session.user.name || token.name;
        token.verified = session.user.verified ?? token.verified;
      }
      
      console.log("✅ JWT Callback - Token updated");
    }

    // ... refresh token logic

    return token;
  },
  // ... session callback
}
```

### 3. Type Definitions

File: `src/types/auth.ts`

```typescript
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
  };
}
```

## 🔄 Flow Update Session

1. **User mengupdate profile** → Panggil `updateProfile()` dari hook
2. **API call berhasil** → Terima response dengan data terbaru
3. **Update session** → Panggil `update()` dari NextAuth dengan data baru
4. **JWT Callback triggered** → NextAuth mendeteksi `trigger: "update"`
5. **Token updated** → Data terbaru disimpan di JWT token
6. **Session updated** → Session di client otomatis terupdate
7. **UI reflects changes** → Komponen yang menggunakan session akan re-render

## 🎯 Penggunaan di Komponen

```typescript
import { useSession } from "next-auth/react";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";

const Component = () => {
  const { data: session } = useSession();
  const { updateProfile, isLoading, error } = useProfileUpdate();

  const handleUpdateProfile = async () => {
    const success = await updateProfile({
      username: "new_username",
      phone: "081234567890"
    });

    if (success) {
      // Session akan otomatis terupdate
      console.log("Updated session:", session);
    }
  };

  return (
    <div>
      <p>Username: {session?.user?.username}</p>
      <p>Phone: {session?.user?.phone}</p>
      <p>Verified: {session?.user?.verified ? 'Yes' : 'No'}</p>
      
      <button onClick={handleUpdateProfile} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};
```

## ✅ Benefits

1. **Real-time Update**: Session langsung terupdate tanpa perlu refresh
2. **Consistent State**: Data di session selalu sync dengan backend
3. **Better UX**: User melihat perubahan langsung di UI
4. **Type Safety**: Menggunakan TypeScript untuk type checking
5. **Error Handling**: Error handling yang proper di hook

## 🚀 Testing

1. Login ke aplikasi
2. Update profile (username/phone)
3. Cek di console untuk log update session
4. Verify data di UI sudah terupdate
5. Refresh page dan pastikan data tetap persist

## 📝 Notes

- Session update menggunakan NextAuth v5 `update()` function
- JWT callback menangani `trigger: "update"` untuk session updates
- Data yang diupdate: `username`, `phone`, `name`, `verified`
- Original JWT token tetap dipertahankan untuk authentication
