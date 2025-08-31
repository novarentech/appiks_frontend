# 🔧 Session Update Troubleshooting Guide

## ❌ Masalah: Session Tidak Terupdate Setelah Profile Update

### 🔍 Debugging Steps

1. **Cek Console Logs**

   - Buka Browser Developer Tools → Console
   - Update profile dan lihat logs berikut:

   ```
   🔄 Updating session with new profile data: {...}
   🔍 Current session before update: {...}
   🔍 Update result: {...}
   ✅ Session updated successfully
   🔄 JWT Callback - Session update triggered: {...}
   🔍 JWT Callback - Current token before update: {...}
   ✅ JWT Callback - Token updated: {...}
   ```

2. **Menggunakan SessionDebugger Component**

   ```tsx
   import { SessionDebugger } from "@/components/debug/SessionDebugger";

   // Tambahkan di komponen untuk memonitor session changes
   <SessionDebugger />;
   ```

### 🐛 Possible Issues & Solutions

#### 1. **JWT Callback Tidak Dipanggil**

**Symptoms:**

- Tidak ada log "JWT Callback - Session update triggered"
- Session tidak berubah meski API sukses

**Cause:**

- File auth configuration tidak menghandle `trigger: "update"`

**Solution:**

```typescript
// File: auth.ts (root)
callbacks: {
  async jwt({ token, user, trigger, session }) {
    // ... existing code

    // Handle session update
    if (trigger === "update" && session) {
      console.log("🔄 JWT Callback - Session update triggered:", session);

      if (session.user) {
        const sessionUser = session.user as {
          username?: string;
          phone?: string;
          name?: string;
          verified?: boolean;
        };

        token.username = sessionUser.username || token.username;
        token.phone = sessionUser.phone || token.phone;
        token.name = sessionUser.name || token.name;
        token.verified = sessionUser.verified ?? token.verified;
      }

      console.log("✅ JWT Callback - Token updated");
    }

    return token;
  }
}
```

#### 2. **Update Function Tidak Dipanggil**

**Symptoms:**

- Tidak ada log "Updating session with new profile data"
- API sukses tapi tidak ada attempt update session

**Cause:**

- `update` function dari `useSession()` tidak dipanggil

**Solution:**

```typescript
// File: useProfileUpdate.ts
const { data: session, update } = useSession();

const updateProfile = async (profileData) => {
  // ... API call

  if (data.success) {
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
  }
};
```

#### 3. **NextAuth Configuration File Mismatch**

**Symptoms:**

- Changes tidak tereflect meski sudah update configuration

**Check:**

```bash
# Cek file mana yang digunakan di API routes
cat src/app/api/auth/[...nextauth]/route.ts

# Harus import dari file yang benar
# Jika ada auth.ts di root:
import { GET, POST } from "../../../../../auth";

# Jika menggunakan src/lib/nextauth.ts:
import { GET, POST } from "@/lib/nextauth";
```

**Solution:**

- Pastikan semua file menggunakan configuration yang sama
- Update import paths jika diperlukan

#### 4. **Type Errors Preventing Compilation**

**Symptoms:**

- Build fails dengan TypeScript errors
- Session properties undefined

**Solution:**

```typescript
// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      verified: boolean;
      token: string;
      expiresIn: string;
      name?: string;
      phone?: string;
    } & DefaultSession["user"];
  }
}
```

#### 5. **Session Cache Issues**

**Symptoms:**

- Update berhasil tapi komponen tidak re-render
- Old data masih muncul di UI

**Solution:**

```typescript
// Force re-fetch session
await update();

// Or with explicit data
await update({
  ...session,
  user: { ...newUserData },
});

// Wait for propagation
await new Promise((resolve) => setTimeout(resolve, 100));
```

### 🎯 Testing Checklist

- [ ] ✅ Build succeeds without errors
- [ ] ✅ Dev server starts successfully
- [ ] ✅ Login works and creates session
- [ ] ✅ Can access profile update form
- [ ] ✅ SessionDebugger shows current session data
- [ ] ✅ Profile update API call succeeds
- [ ] ✅ Console shows "Updating session" log
- [ ] ✅ Console shows "JWT Callback triggered" log
- [ ] ✅ Console shows "Session updated successfully" log
- [ ] ✅ SessionDebugger shows updated data
- [ ] ✅ UI components reflect new data
- [ ] ✅ Page refresh maintains updated data

### 🔧 Manual Testing Steps

1. **Setup**

   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

2. **Login**

   - Go to /login
   - Enter credentials
   - Verify session is created

3. **Check Initial Session**

   - Go to /fill-data
   - Look at SessionDebugger component
   - Note current username/phone

4. **Update Profile**

   - Change username and/or phone
   - Submit form
   - Check console for logs

5. **Verify Update**
   - SessionDebugger should show new data
   - No page refresh needed
   - Data should persist on refresh

### 📋 Expected Log Flow

```
🔄 Updating session with new profile data: {username: "new_user", phone: "081234567890", ...}
🔍 Current session before update: {user: {username: "old_user", ...}}
🔍 Update result: null (this is normal for NextAuth v5)
✅ Session updated successfully
🔄 JWT Callback - Session update triggered: {user: {username: "new_user", ...}}
🔍 JWT Callback - Current token before update: {username: "old_user", ...}
✅ JWT Callback - Token updated: {username: "new_user", phone: "081234567890", ...}
📊 Session Debug - Data: {user: {username: "new_user", phone: "081234567890", ...}}
```

### 🚨 Common Pitfalls

1. **Wrong Auth Config File**: Mengupdate file yang tidak digunakan
2. **Missing Trigger Handler**: JWT callback tidak menghandle `trigger: "update"`
3. **Type Mismatches**: Session user properties tidak sesuai dengan expected types
4. **Async Issues**: Tidak menunggu update selesai sebelum check results
5. **Cache Problems**: Browser cache atau NextAuth cache tidak terupdate

### 💡 Pro Tips

- Gunakan `SessionDebugger` component untuk real-time monitoring
- Check Network tab untuk melihat `/api/auth/session` calls
- Log `session` object sebelum dan sesudah update
- Test dengan browser incognito untuk avoid cache issues
- Verify database/backend juga terupdate (jika applicable)
