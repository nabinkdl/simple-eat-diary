import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  className?: string;
}

export function StatCard({ icon, label, value, suffix, className }: StatCardProps) {
  return (
    <div className={cn("card-elevated p-6 animate-fade-in flex flex-col justify-between h-full bg-card/80 backdrop-blur-sm hover:shadow-elevated transition-shadow duration-500", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-secondary/50 text-foreground ring-1 ring-border/50">
          {icon}
        </div>
        <span className="text-sm font-medium text-muted-foreground leading-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 translate-y-1">
        <span className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</span>
        {suffix && <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{suffix}</span>}
      </div>
    </div>
  );
}
