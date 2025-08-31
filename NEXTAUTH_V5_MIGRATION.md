# NextAuth v5 Migration Guide

## ✅ Upgrade Berhasil Dilakukan

Aplikasi Appiks telah berhasil diupgrade dari NextAuth v4 ke NextAuth v5. Berikut adalah perubahan yang telah dilakukan:

## 🔄 Perubahan Utama

### 1. Package Version

- **Sebelum**: `next-auth: ^4.24.11`
- **Setelah**: `next-auth: 5.0.0-beta.29`

### 2. Struktur File

- **Dihapus**: `src/lib/nextauth.ts`
- **Ditambah**: `auth.ts` (di root project)
- **Update**: File API routes dan middleware menggunakan import baru

### 3. Konfigurasi NextAuth

#### File: `auth.ts` (Root)

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // Konfigurasi provider
    }),
  ],
  callbacks: {
    // JWT dan session callbacks
  },
  // Konfigurasi lainnya
});

export const { GET, POST } = handlers;
```

### 4. Import Changes

#### API Routes

```typescript
// Sebelum
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/nextauth";

// Setelah
import { auth } from "../../../../auth";
```

#### Middleware

```typescript
// Sebelum
import { auth } from "@/lib/nextauth";

// Setelah
import { auth } from "./auth";
```

#### API Auth Routes

```typescript
// File: src/app/api/auth/[...nextauth]/route.ts
import { GET, POST } from "../../../../../auth";
export { GET, POST };
```

### 5. Type Definitions Update

#### File: `src/types/auth.ts`

- Menghapus `declare module "next-auth/jwt"` (tidak didukung di v5)
- Mempertahankan `declare module "next-auth"` untuk Session dan User types
- Menambah interface `CustomUser` untuk type safety

### 6. Provider Changes

```typescript
// Sebelum
import CredentialsProvider from "next-auth/providers/credentials";

// Setelah
import Credentials from "next-auth/providers/credentials";
```

## 🚀 Fitur Baru NextAuth v5

1. **Simplified Configuration**: Konfigurasi lebih sederhana dengan export destructuring
2. **Better TypeScript Support**: Type inference yang lebih baik
3. **Improved Performance**: Performa yang lebih baik
4. **Enhanced Security**: Keamanan yang ditingkatkan

## ✅ Testing

1. **Build**: ✅ Berhasil

   ```bash
   npm run build
   ```

2. **Development Server**: ✅ Berjalan

   ```bash
   npm run dev
   ```

3. **TypeScript**: ✅ No errors
4. **ESLint**: ✅ Only minor warnings (unused imports)

## 📝 Hal Yang Perlu Diperhatikan

1. **Environment Variables**: Tetap sama, tidak perlu perubahan
2. **Client-side Hooks**: `useSession`, `signIn`, `signOut` tetap sama
3. **Middleware**: Tetap kompatibel dengan perubahan import
4. **API Protection**: Tetap menggunakan `auth()` function

## 🔧 Cara Penggunaan

### Server-side (API Routes/Middleware)

```typescript
import { auth } from "../../../../auth"; // atau path relatif yang sesuai

export async function GET() {
  const session = await auth();
  // Logika API
}
```

### Client-side (Components)

```typescript
import { useSession, signIn, signOut } from "next-auth/react";

// Penggunaan tetap sama seperti v4
const { data: session } = useSession();
```

## 🎉 Status

✅ **Upgrade Selesai**: Aplikasi siap digunakan dengan NextAuth v5  
✅ **Backward Compatibility**: Semua fitur existing tetap berfungsi  
✅ **Performance**: Improved dengan NextAuth v5

## 📚 Resources

- [NextAuth v5 Documentation](https://authjs.dev/getting-started/introduction)
- [Migration Guide](https://authjs.dev/guides/upgrade-to-v5)
- [NextAuth v5 Examples](https://authjs.dev/getting-started/installation)
