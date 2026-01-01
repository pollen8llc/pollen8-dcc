import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Folder, UserPlus, Tags, Bell, Zap } from "lucide-react";
import { useSetupProgress, SetupTask } from "@/hooks/useSetupProgress";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Folder,
  UserPlus,
  Tags,
  Bell,
  Zap,
};

const SetupTaskCard = ({ task, index }: { task: SetupTask; index: number }) => {
  const navigate = useNavigate();
  const isComplete = task.current >= task.target;
  const progress = Math.min((task.current / task.target) * 100, 100);
  const Icon = iconMap[task.icon] || Folder;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={() => navigate(task.route)}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
        "bg-card/40 backdrop-blur-sm border border-border/50",
        "hover:bg-card/60 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        "group cursor-pointer text-left",
        isComplete && "border-primary/40 bg-primary/5"
      )}
    >
      {/* Icon & Progress Circle */}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            isComplete
              ? "bg-primary/20 text-primary"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Circular Progress Ring */}
        {!isComplete && (
          <svg className="absolute inset-0 w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              initial={{ strokeDasharray: "0 126" }}
              animate={{ strokeDasharray: `${(progress / 100) * 126} 126` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              "font-semibold text-sm transition-colors",
              isComplete ? "text-primary" : "text-foreground"
            )}
          >
            {task.title}
          </h4>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              isComplete
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {task.current}/{task.target}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {task.description}
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight
        className={cn(
          "h-5 w-5 flex-shrink-0 transition-all duration-300",
          isComplete
            ? "text-primary/50"
            : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
        )}
      />
    </motion.button>
  );
};

export const SetupProgress = () => {
  const { tasks, completedCount, totalTasks, isComplete, isLoading } = useSetupProgress();

  // Don't render if setup is complete
  if (isComplete) return null;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-muted/50 rounded-full" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-muted/50 rounded mb-2" />
              <div className="h-4 w-48 bg-muted/50 rounded" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (completedCount / totalTasks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-lg shadow-black/5">
        {/* Header with Progress Ring */}
        <div className="flex items-center gap-4 mb-6">
          {/* Large Progress Ring */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted/20"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 176" }}
                animate={{ strokeDasharray: `${(progressPercent / 100) * 176} 176` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">
                {completedCount}
                <span className="text-muted-foreground text-xs">/{totalTasks}</span>
              </span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              Complete your setup
            </h3>
            <p className="text-sm text-muted-foreground">
              {completedCount === 0
                ? "Get started by completing these quick tasks"
                : `${totalTasks - completedCount} task${totalTasks - completedCount !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <SetupTaskCard key={task.id} task={task} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SetupProgress;
