import Navbar from "@/components/layouts/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar/>
      <main className="container mx-auto p-5">{children}</main>
    </div>
  );
}
