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
    color: 'hsl(199, 89%, 86%)', // sky-300
    bgClass: 'bg-sky-300',
    gradientClass: 'from-white to-sky-300',
    textClass: 'text-sky-300',
  },
  ember: {
    id: 'ember',
    label: 'Ember',
    description: 'Developing relationship',
    percentage: 50,
    color: 'hsl(217, 91%, 60%)', // blue-500
    bgClass: 'bg-blue-500',
    gradientClass: 'from-sky-300 to-blue-500',
    textClass: 'text-blue-400',
  },
  flame: {
    id: 'flame',
    label: 'Flame',
    description: 'Established connection',
    percentage: 75,
    color: 'hsl(239, 84%, 67%)', // indigo-500
    bgClass: 'bg-indigo-500',
    gradientClass: 'from-blue-500 to-indigo-500',
    textClass: 'text-indigo-400',
  },
  star: {
    id: 'star',
    label: 'Star',
    description: 'Strong, trusted relationship',
    percentage: 100,
    color: 'hsl(258, 90%, 66%)', // violet-500
    bgClass: 'bg-violet-500',
    gradientClass: 'from-indigo-500 to-violet-500',
    textClass: 'text-violet-400',
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
