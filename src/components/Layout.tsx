import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { PageTransition } from "./PageTransition";

export function Layout() {
  return (
    <div className="flex flex-col h-full w-full bg-background transition-colors duration-300">
      <Header />
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-28 md:pb-10 no-scrollbar scroll-smooth">
        <div className="container max-w-4xl mx-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
