import Navbar from "@/components/layouts/Navbar";
import AuthProtect from "@/configs/AuthProtect";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProtect>
      <Navbar />
      <main className="mt-14">{children}</main>
    </AuthProtect>
  );
}