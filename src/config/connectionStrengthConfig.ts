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
    color: 'hsl(24, 95%, 53%)', // orange-500
    bgClass: 'bg-orange-500',
    gradientClass: 'from-orange-500 to-orange-400',
    textClass: 'text-orange-500',
  },
  ember: {
    id: 'ember',
    label: 'Ember',
    description: 'Developing relationship',
    percentage: 50,
    color: 'hsl(45, 93%, 47%)', // yellow-500
    bgClass: 'bg-yellow-500',
    gradientClass: 'from-orange-400 to-yellow-400',
    textClass: 'text-yellow-500',
  },
  flame: {
    id: 'flame',
    label: 'Flame',
    description: 'Established connection',
    percentage: 75,
    color: 'hsl(160, 84%, 39%)', // emerald-500
    bgClass: 'bg-emerald-500',
    gradientClass: 'from-yellow-400 to-emerald-500',
    textClass: 'text-emerald-500',
  },
  star: {
    id: 'star',
    label: 'Star',
    description: 'Strong, trusted relationship',
    percentage: 100,
    color: 'hsl(160, 84%, 39%)', // emerald-500
    bgClass: 'bg-teal-500',
    gradientClass: 'from-emerald-500 to-teal-400',
    textClass: 'text-teal-500',
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
