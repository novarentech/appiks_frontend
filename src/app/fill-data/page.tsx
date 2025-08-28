import { FillData } from "@/components/auth/FillData";

export default function fillDataPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 py-10 sm:py-16 lg:py-20">
        <div className="text-center mb-18">
          <h1 className="text-3xl font-bold mb-2">
            Yuk Lengkapi Dulu Profilmu Sebelum Memulai !
          </h1>
        </div>
        <FillData />
      </div>
    </div>
  );
}
