import { MealButton } from "./MealButton";
import { Sun, Moon } from "lucide-react";

interface MealSectionProps {
  title: string;
  type: 'morning' | 'night';
  value: boolean | null;
  onSelect: (value: boolean) => void;
  disabled?: boolean;
}

export function MealSection({ title, type, value, onSelect, disabled }: MealSectionProps) {
  const Icon = type === 'morning' ? Sun : Moon;
  
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-display text-xl text-foreground">{title}</h3>
      </div>
      
      <div className="flex gap-3">
        <MealButton
          type="yes"
          selected={value === true}
          onClick={() => onSelect(true)}
          disabled={disabled}
        />
        <MealButton
          type="no"
          selected={value === false}
          onClick={() => onSelect(false)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
