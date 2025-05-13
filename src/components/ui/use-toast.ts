import { useToast, toast } from "@/hooks/use-toast";

// Customize default toast settings with the new theme
// For teal highlight color and rounded corners
const defaultToastOptions = {
  className: "bg-card border-border text-foreground rounded-xl",
  descriptionClassName: "text-muted-foreground",
  actionClassName: "bg-[#00eada] text-black hover:bg-[#00eada]/90 rounded-lg",
  duration: 5000,
};

// Extend toast with default options
const enhancedToast = {
  ...toast,
  // Default toast
  show: (props: Parameters<typeof toast>[0]) => 
    toast({ ...defaultToastOptions, ...props }),
  // Destructive toast
  error: (props: Parameters<typeof toast.error>[0]) => 
    toast.error({ ...defaultToastOptions, ...props }),
};

export { useToast, enhancedToast as toast };
