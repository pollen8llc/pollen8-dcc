import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"
import { UserRole } from "@/models/types"
import { DynamicAvatar } from "./dynamic-avatar"

interface ExtendedAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  isAdmin?: boolean;
  userId?: string;
  useDynamicAvatar?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  ExtendedAvatarProps
>(({ className, isAdmin, userId, useDynamicAvatar = true, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      isAdmin ? "admin-avatar-border" : "",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  userId?: string;
  useDynamicAvatar?: boolean;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, children, userId, useDynamicAvatar = true, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted relative overflow-hidden",
        className
      )}
      {...props}
    >
      {children || (useDynamicAvatar ? (
        <DynamicAvatar 
          userId={userId}
          className="w-full h-full"
          fallbackToMagnetosphere={true}
        />
      ) : (
        <svg width="100%" height="100%" viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="defaultMagnetosphere" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="8" fill="url(#defaultMagnetosphere)" />
          <circle cx="32" cy="32" r="16" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="32" cy="32" r="12" fill="none" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
          </circle>
        </svg>
      ))}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }