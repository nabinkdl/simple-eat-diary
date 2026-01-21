import { Link, useLocation } from "react-router-dom";
import { Calendar, Utensils, Settings, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: Calendar, label: "History" },
  { path: "/dashboard/history", icon: Utensils, label: "Today" },
  { path: "/dashboard/analytics", icon: PieChart, label: "Analytics" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav md:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "nav-item relative",
                isActive ? "nav-item-active" : "nav-item"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive && "bg-primary/10 -translate-y-1"
              )}>
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>{label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-fade-in" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
