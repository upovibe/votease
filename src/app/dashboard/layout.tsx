import ProtectedRoute from "@/configs/ProtectedRoute";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <main>{children}</main>
    </ProtectedRoute>
  );
}
