import { Button } from "@/components/ui/button";
import { User as UserIcon, LogOut } from "lucide-react";
import { User } from "firebase/auth";

interface UserCardProps {
    user: User | null;
    onLogout: () => void;
}

export function UserCard({ user, onLogout }: UserCardProps) {
    return (
        <div className="glass-card p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-card overflow-hidden">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <UserIcon className="w-8 h-8" />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold truncate">{user?.displayName || "Guest User"}</h2>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="w-5 h-5 text-destructive" />
            </Button>
        </div>
    );
}
