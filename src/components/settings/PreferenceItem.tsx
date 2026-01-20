import { ReactNode } from "react";

interface PreferenceItemProps {
    icon: ReactNode;
    title: string;
    description: string;
    action: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export function PreferenceItem({
    icon,
    title,
    description,
    action,
    iconBgColor = "bg-primary/10",
    iconColor = "text-primary"
}: PreferenceItemProps) {
    return (
        <div className="p-4 flex items-center justify-between group hover:bg-secondary/20 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${iconBgColor} ${iconColor}`}>
                    {icon}
                </div>
                <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">{description}</div>
                </div>
            </div>
            {action}
        </div>
    );
}
