import { Link, useLocation } from "react-router-dom";
import { Calendar, Utensils, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", icon: Calendar, label: "Calendar" },
  { path: "/dashboard/history", icon: Utensils, label: "Today" },
  { path: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="hidden md:block bg-card/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard/history" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-transform group-hover:scale-105">
              <Utensils className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl text-foreground font-bold tracking-tight">MealTracker</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;

              return (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft scale-105"
                      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
