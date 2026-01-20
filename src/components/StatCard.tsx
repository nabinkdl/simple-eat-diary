import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
}

export function StatCard({ icon, label, value, suffix }: StatCardProps) {
  return (
    <div className="card-elevated p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground font-body">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-display text-foreground">{value}</span>
        {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
