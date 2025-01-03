import AuthRedirect from "@/configs/AuthRedirect";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthRedirect>
      <main>{children}</main>
    </AuthRedirect>
  );
}