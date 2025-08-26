import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:grid-cols-2 p-5">
          <div className="bg-muted relative hidden md:block rounded-l-lg overflow-hidden">
            <Image
              width={300}
              height={300}
              src="/image/imgPic.webp"
              alt="Image"
              priority
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
            <div className="p-4 md:px-10 md:py-14 flex flex-col items-center w-full">
            <Link href={"/"} className="text-3xl md:text-5xl text-center font-normal mb-8">Appiks</Link>
            <form className="border p-4 md:p-6 rounded-lg w-full max-w-xs">
              <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="font-bold text-lg md:text-xl">Masuk ke Akun</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                Isi data dibawah ini untuk masuk ke akun Anda
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto text-xs md:text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </Link>
                </div>
                <Input id="password" type="password" placeholder="masukkan password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
