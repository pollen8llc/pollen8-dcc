interface TrustRatingBarProps {
  rating: number; // 1-5
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function TrustRatingBar({ rating, showLabel = true, size = 'md' }: TrustRatingBarProps) {
  const percentage = (rating / 5) * 100;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  // Color based on rating
  const getColor = () => {
    if (rating >= 4) return 'bg-emerald-500';
    if (rating >= 3) return 'bg-primary';
    if (rating >= 2) return 'bg-amber-500';
    return 'bg-destructive';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">Trust Rating</span>
          <span className="text-xs font-medium">{rating}/5</span>
        </div>
      )}
      <div className={`w-full bg-muted/50 rounded-full ${heights[size]} overflow-hidden`}>
        <div 
          className={`${heights[size]} rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
