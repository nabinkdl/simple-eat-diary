import { useState, useEffect } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { X, Download, Share, MoreVertical, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function PWAInstallBanner() {
    const { isInstallable, isStandalone, isIOS, isAndroid, install } = usePWA();
    const [isVisible, setIsVisible] = useState(false);
    const [iosHelpOpen, setIosHelpOpen] = useState(false);
    const [androidHelpOpen, setAndroidHelpOpen] = useState(false);

    useEffect(() => {
        // Check local storage for dismissal
        const dismissedAt = localStorage.getItem('pwa_dismissed_at');
        if (dismissedAt) {
            const diff = Date.now() - parseInt(dismissedAt, 10);
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            if (diff < twoDays) return;
        }

        // Show banner if not installed (standalone) and either installable or on mobile
        // Delay slightly to not annoy immediately
        const timer = setTimeout(() => {
            if (!isStandalone && (isInstallable || isIOS || isAndroid)) {
                setIsVisible(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [isStandalone, isInstallable, isIOS, isAndroid]);

    const handleInstallClick = () => {
        if (isInstallable) {
            install();
        } else if (isIOS) {
            setIosHelpOpen(true);
        } else if (isAndroid) {
            setAndroidHelpOpen(true);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa_dismissed_at', Date.now().toString());
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-20 md:bottom-6 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center"
                    >
                        <div className="bg-foreground/90 backdrop-blur-md text-background p-4 rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto flex items-center justify-between gap-4 border border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <Download className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Install App</h4>
                                    <p className="text-xs text-background/70">For the best experience</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleInstallClick}
                                    className="rounded-xl bg-background text-foreground hover:bg-background/90 font-bold"
                                >
                                    Install
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleDismiss}
                                    className="rounded-full w-8 h-8 hover:bg-white/20 text-background/50 hover:text-background"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reusing Help Dialogs (could be componentized further but keeping local for speed) */}

            {/* iOS Install Help Dialog */}
            <Dialog open={iosHelpOpen} onOpenChange={setIosHelpOpen}>
                <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2rem] p-6">
                    <DialogHeader>
                        <DialogTitle>Install on iOS</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">To install this app on your iPhone:</p>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className="p-2 bg-background rounded-lg shadow-sm">
                                <Share className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-sm font-medium">1. Tap the <span className="font-bold">Share</span> button</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className="p-2 bg-background rounded-lg shadow-sm">
                                <PlusSquare className="w-5 h-5 text-foreground" />
                            </div>
                            <p className="text-sm font-medium">2. Select <span className="font-bold">Add to Home Screen</span></p>
                        </div>
                        <Button className="w-full rounded-xl" onClick={() => setIosHelpOpen(false)}>Got it</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Android Install Help Dialog */}
            <Dialog open={androidHelpOpen} onOpenChange={setAndroidHelpOpen}>
                <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-[2rem] p-6">
                    <DialogHeader>
                        <DialogTitle>Install on Android</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">If the install prompt didn't appear:</p>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className="p-2 bg-background rounded-lg shadow-sm">
                                <MoreVertical className="w-5 h-5 text-foreground" />
                            </div>
                            <p className="text-sm font-medium">1. Tap the <span className="font-bold">three dots</span> menu</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                            <div className="p-2 bg-background rounded-lg shadow-sm">
                                <Download className="w-5 h-5 text-foreground" />
                            </div>
                            <p className="text-sm font-medium">2. Select <span className="font-bold">Install App</span> or <span className="font-bold">Add to Home screen</span></p>
                        </div>
                        <Button className="w-full rounded-xl" onClick={() => setAndroidHelpOpen(false)}>Got it</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
