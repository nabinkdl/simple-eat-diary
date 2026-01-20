import { Link, useLocation } from "react-router-dom";
import { Calendar, Utensils, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: Calendar, label: "Calendar" },
  { path: "/dashboard/history", icon: Utensils, label: "Today" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(isActive ? "nav-item-active" : "nav-item")}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
