import { developmentPaths, DevelopmentPath } from "@/data/mockNetworkData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PathSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPath: (pathId: string) => void;
  currentPathId?: string;
}

export function PathSelectionModal({
  open,
  onOpenChange,
  onSelectPath,
  currentPathId
}: PathSelectionModalProps) {
  const handleSelect = (pathId: string) => {
    onSelectPath(pathId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose Development Path</DialogTitle>
          <DialogDescription>
            Select a path to guide your relationship development with this contact
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {developmentPaths.map((path) => (
            <PathOption
              key={path.id}
              path={path}
              isSelected={path.id === currentPathId}
              onSelect={() => handleSelect(path.id)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PathOption({
  path,
  isSelected,
  onSelect
}: {
  path: DevelopmentPath;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const strengthLabels = {
    growing: 'Growing Connection',
    solid: 'Solid Connection',
    thick: 'Deep Bond'
  };

  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 rounded-lg border transition-all hover:border-primary/50 ${
        isSelected 
          ? 'border-primary bg-primary/10' 
          : 'border-border/40 bg-card/30'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium">{path.name}</h4>
        {isSelected && (
          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
            CURRENT
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{path.description}</p>
      
      {/* Steps Preview */}
      <div className="flex items-center gap-1 mb-2">
        {path.steps.map((_, index) => (
          <div
            key={index}
            className="h-1.5 flex-1 rounded-full bg-muted"
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{path.steps.length} steps</span>
        <span>Target: {strengthLabels[path.targetStrength]}</span>
      </div>
    </button>
  );
}
