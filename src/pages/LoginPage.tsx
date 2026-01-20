import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Utensils, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LoginPage() {
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/dashboard/history");
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate("/dashboard/history");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background overflow-hidden relative">
            {/* Decorative Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Left Panel - Brand & Form */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="max-w-md w-full space-y-10">
                    <div className="space-y-4">
                        <motion.div
                            className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elevated mb-6"
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <Utensils className="w-8 h-8 text-white" />
                        </motion.div>

                        <h1 className="font-display text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                            Eat well,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                                Live better.
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-sm">
                            Your personal companion for tracking daily meals, monitoring expenses, and building consistent healthy habits.
                        </p>
                    </div>

                    <div className="space-y-6 pt-4">
                        <Button
                            onClick={handleLogin}
                            className="w-full h-16 text-lg font-medium rounded-2xl bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-card group relative overflow-hidden"
                            variant="outline"
                        >
                            <div className="absolute inset-0 bg-slate-100/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <div className="relative flex items-center justify-center gap-3">
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-6 h-6"
                                />
                                Continue with Google
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Button>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground/60 justify-center">
                            <span>Secure Login</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>Privacy Focused</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>Cloud Sync</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Panel - Visual/Image */}
            <motion.div
                className="hidden lg:block w-1/2 p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="w-full h-full rounded-[2.5rem] bg-slate-100 overflow-hidden relative shadow-2xl border border-white/50">
                    <img
                        src="https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2000&auto=format&fit=crop"
                        alt="Healthy Food Flatlay"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <div className="glass p-6 rounded-3xl backdrop-blur-md border-white/20">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <span className="text-lg">🥗</span>
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg text-white">Daily Consistency</h3>
                                    <p className="text-white/60 text-sm">Track your progress seamlessly</p>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
