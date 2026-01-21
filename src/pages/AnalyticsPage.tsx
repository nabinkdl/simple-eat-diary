import { useMemo } from "react";
import { useAllMeals } from "@/contexts/MealsContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, PieChart as PieChartIcon, Activity, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NEPALI_MONTHS } from "@/lib/nepali-utils";
import NepaliDate from "nepali-date-converter";
import { getDateKey } from "@/lib/storage";

export default function AnalyticsPage() {
    const { meals, loading } = useAllMeals();
    const { settings } = useSettings();

    const {
        totalSpend,
        mealDistribution,
        monthlyTrends,
        consistencyScore
    } = useMemo(() => {
        if (loading) return { totalSpend: 0, mealDistribution: [], monthlyTrends: [], consistencyScore: 0 };

        let totalMorning = 0;
        let totalNight = 0;
        let totalAll = 0;
        const monthlyCounts: Record<string, { name: string, meals: number, cost: number }> = {};

        // Sort keys to process chronologically
        const sortedKeys = Object.keys(meals).sort();

        sortedKeys.forEach(key => {
            const record = meals[key];
            let dailyCount = 0;
            if (record.morning) { totalMorning++; dailyCount++; }
            if (record.night) { totalNight++; dailyCount++; }

            totalAll += dailyCount;

            // Group by Nepali Month
            // Convert key (YYYY-MM-DD) to date then to Nepali
            const [y, m, d] = key.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            const nepDate = new NepaliDate(date);
            const monthName = `${NEPALI_MONTHS[nepDate.getMonth()]} ${nepDate.getYear()}`; // Unique key per month-year

            if (!monthlyCounts[monthName]) {
                monthlyCounts[monthName] = { name: NEPALI_MONTHS[nepDate.getMonth()], meals: 0, cost: 0 };
            }
            monthlyCounts[monthName].meals += dailyCount;
            monthlyCounts[monthName].cost += (dailyCount * settings.pricePerMeal);
        });

        // Take last 6 months for trends
        const trends = Object.values(monthlyCounts).slice(-6);

        // Calc Streak/Consistency (Simple version: % of tracked days in last 30 days)
        // For now, let's just use "Average Daily Meals"
        const consistency = totalAll > 0 ? (totalAll / sortedKeys.length).toFixed(1) : 0;

        return {
            totalSpend: totalAll * settings.pricePerMeal,
            mealDistribution: [
                { name: "Morning", value: totalMorning, color: "#F59E0B" }, // Amber
                { name: "Night", value: totalNight, color: "#6366F1" }     // Indigo
            ],
            monthlyTrends: trends,
            consistencyScore: consistency
        };

    }, [meals, loading, settings.pricePerMeal]);

    const COLORS = ["#F59E0B", "#6366F1"];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-6 pb-24"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <div className="flex items-center justify-between pt-6 px-2">
                <div>
                    <h1 className="font-display text-4xl font-bold text-foreground tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground font-medium">Insights into your habits</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-full">
                    <PieChartIcon className="w-6 h-6 text-primary" />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-3xl" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={itemVariants} className="bg-card/40 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Spend</span>
                            </div>
                            <p className="text-2xl font-bold font-display">₹{totalSpend.toLocaleString()}</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="bg-card/40 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Meals/Day</span>
                            </div>
                            <p className="text-2xl font-bold font-display">{consistencyScore}</p>
                        </motion.div>
                    </div>

                    {/* Monthly Trends Chart */}
                    <motion.div variants={itemVariants} className="glass-card p-6 border-white/10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Monthly Trends
                        </h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyTrends}>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'var(--muted)/20' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)', backgroundColor: 'var(--card)' }}
                                    />
                                    <Bar dataKey="meals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Meal Distribution */}
                    <motion.div variants={itemVariants} className="glass-card p-6 border-white/10">
                        <h3 className="text-lg font-bold mb-2">Meal Split</h3>
                        <div className="flex items-center justify-between">
                            <div className="h-[160px] w-[160px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={mealDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {mealDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                    <span className="text-xs text-muted-foreground font-medium">Total</span>
                                    <span className="text-xl font-bold">{mealDistribution.reduce((a, b) => a + b.value, 0)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 flex-1 pl-6">
                                {mealDistribution.map((item) => (
                                    <div key={item.name} className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.value} meals</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
