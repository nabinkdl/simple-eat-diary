import { motion } from "framer-motion";

export const PageLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <motion.div
            className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
            className="mt-4 text-muted-foreground font-medium animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            Loading...
        </motion.p>
    </div>
);
