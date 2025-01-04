import Navbar from "@/components/layouts/Navbar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar/>
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
