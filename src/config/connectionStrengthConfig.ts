/**
 * Centralized connection strength configuration
 * All components should use these values for consistent styling
 */

export type ConnectionStrengthLevel = 'spark' | 'ember' | 'flame' | 'star';

export interface StrengthConfig {
  id: ConnectionStrengthLevel;
  label: string;
  description: string;
  percentage: number;
  color: string; // HSL color for inline styles
  bgClass: string; // Tailwind background class
  gradientClass: string; // Tailwind gradient class for progress bars
  textClass: string; // Tailwind text color class
}

export const connectionStrengthConfig: Record<ConnectionStrengthLevel, StrengthConfig> = {
  spark: {
    id: 'spark',
    label: 'Spark',
    description: 'New or weak connection',
    percentage: 25,
    color: 'hsl(0, 84%, 60%)',
    bgClass: 'bg-rose-500',
    gradientClass: 'from-rose-500 to-red-400',
    textClass: 'text-rose-500',
  },
  ember: {
    id: 'ember',
    label: 'Ember',
    description: 'Developing relationship',
    percentage: 50,
    color: 'hsl(38, 92%, 50%)',
    bgClass: 'bg-amber-500',
    gradientClass: 'from-amber-500 to-yellow-400',
    textClass: 'text-amber-500',
  },
  flame: {
    id: 'flame',
    label: 'Flame',
    description: 'Established connection',
    percentage: 75,
    color: 'hsl(174, 100%, 46%)',
    bgClass: 'bg-teal-500',
    gradientClass: 'from-teal-500 to-cyan-400',
    textClass: 'text-teal-500',
  },
  star: {
    id: 'star',
    label: 'Star',
    description: 'Strong, trusted relationship',
    percentage: 100,
    color: 'hsl(174, 100%, 46%)',
    bgClass: 'bg-primary',
    gradientClass: 'from-primary to-cyan-300',
    textClass: 'text-primary',
  },
};

/**
 * Get strength configuration by ID
 */
export function getStrengthConfig(strength: ConnectionStrengthLevel | string): StrengthConfig {
  const normalizedStrength = strength.toLowerCase() as ConnectionStrengthLevel;
  return connectionStrengthConfig[normalizedStrength] || connectionStrengthConfig.spark;
}

/**
 * Get all strength configurations as an array (useful for iteration)
 */
export function getAllStrengthConfigs(): StrengthConfig[] {
  return Object.values(connectionStrengthConfig);
}
