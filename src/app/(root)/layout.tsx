import Navbar from "@/components/layouts/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar/>
      <main className="mt-14">{children}</main>
    </div>
  );
}
