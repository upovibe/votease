import Navbar from "@/components/layouts/Navbar";
import ProtectedRoute from "@/configs/ProtectedRoute";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <Navbar/>
      <main>{children}</main>
    </ProtectedRoute>
  );
}
