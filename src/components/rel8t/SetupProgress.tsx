import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Folder, 
  UserPlus, 
  Tags, 
  Bell, 
  Zap, 
  Check,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import { useSetupProgress, SetupTask } from "@/hooks/useSetupProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Folder,
  UserPlus,
  Tags,
  Bell,
  Zap,
};

const SetupProgress = () => {
  const { tasks, completedCount, totalTasks, isComplete, isLoading } = useSetupProgress();

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading progress...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return null;
  }

  const progressPercentage = (completedCount / totalTasks) * 100;
  
  // Find the first incomplete task
  const firstIncompleteTaskId = tasks.find(task => task.current < task.target)?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-muted/30"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${progressPercentage * 0.88} 88`}
                  initial={{ strokeDasharray: "0 88" }}
                  animate={{ strokeDasharray: `${progressPercentage * 0.88} 88` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{completedCount}/{totalTasks}</span>
              </div>
            </div>

            <div className="flex-1">
              <CardTitle className="text-xl font-bold">Complete Your Setup</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Follow these steps to get the most out of REL8
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Accordion type="single" collapsible className="space-y-2">
            {tasks.map((task, index) => (
              <SetupTaskAccordion 
                key={task.id} 
                task={task} 
                index={index}
                isFirstIncomplete={task.id === firstIncompleteTaskId}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface SetupTaskAccordionProps {
  task: SetupTask;
  index: number;
  isFirstIncomplete: boolean;
}

const SetupTaskAccordion = ({ task, index, isFirstIncomplete }: SetupTaskAccordionProps) => {
  const navigate = useNavigate();
  const Icon = iconMap[task.icon] || Folder;
  const isComplete = task.current >= task.target;
  const progress = (task.current / task.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <AccordionItem 
        value={task.id}
        className={cn(
          "rounded-xl border-2 overflow-hidden",
          !(isFirstIncomplete && !isComplete) && "transition-all duration-300",
          isComplete 
            ? "bg-primary/5 border-primary/30" 
            : "bg-card/40 border-border/50",
          isFirstIncomplete && !isComplete && "animate-pulse-border"
        )}
      >
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            {/* Icon with completion state */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
              isComplete 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/50 text-muted-foreground"
            )}>
              {isComplete ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>

            {/* Title and description */}
            <div className="flex-1 text-left">
              <h4 className={cn(
                "font-semibold text-sm",
                isComplete && "text-muted-foreground line-through"
              )}>
                {task.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {task.description}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mr-2">
              <div className="relative w-8 h-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className="stroke-muted/30"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className={cn(
                      "transition-all duration-500",
                      isComplete ? "stroke-primary" : "stroke-primary/60"
                    )}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 0.88} 88`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold">{task.current}/{task.target}</span>
                </div>
              </div>
            </div>
          </div>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4">
          <div className="pt-2 pl-14">
            <ol className="space-y-2 mb-4">
              {task.steps.map((step, stepIndex) => (
                <li 
                  key={stepIndex}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted/50 text-xs font-medium flex items-center justify-center mt-0.5">
                    {stepIndex + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <Button
              onClick={() => navigate(task.route)}
              className="w-full gap-2"
              variant={isComplete ? "secondary" : "default"}
            >
              {isComplete ? "View" : "Let's Go"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
};

export default SetupProgress;
