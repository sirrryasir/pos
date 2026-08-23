import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 pl-0 md:pl-64 h-full">
        <div className="h-full p-4 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </>
  );
}
