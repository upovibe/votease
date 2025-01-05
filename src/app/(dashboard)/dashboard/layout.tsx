import Navbar from "@/components/layouts/Navbar";
import AuthProtect from "@/configs/AuthProtect";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProtect>
      <Navbar />
      <main>{children}</main>
    </AuthProtect>
  );
}