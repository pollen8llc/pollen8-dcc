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
  // Override the default toast function
  default: (props: Parameters<typeof toast.default>[0]) => 
    toast.default({ ...defaultToastOptions, ...props }),
  // Other toast variants
  success: (props: Parameters<typeof toast.success>[0]) => 
    toast.success({ ...defaultToastOptions, ...props }),
  error: (props: Parameters<typeof toast.error>[0]) => 
    toast.error({ ...defaultToastOptions, ...props }),
  warning: (props: Parameters<typeof toast.warning>[0]) => 
    toast.warning({ ...defaultToastOptions, ...props }),
  info: (props: Parameters<typeof toast.info>[0]) => 
    toast.info({ ...defaultToastOptions, ...props }),
};

export { useToast, enhancedToast as toast };
