import { cn } from "@/lib/utils";

interface MealButtonProps {
  type: 'yes' | 'no';
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function MealButton({ type, selected, onClick, disabled }: MealButtonProps) {
  const isYes = type === 'yes';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        isYes
          ? selected
            ? 'btn-meal-yes'
            : 'btn-meal-yes-outline'
          : selected
            ? 'btn-meal-no'
            : 'btn-meal-no-outline',
        'flex-1 min-w-[120px]',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isYes ? 'YES' : 'NO'}
    </button>
  );
}
