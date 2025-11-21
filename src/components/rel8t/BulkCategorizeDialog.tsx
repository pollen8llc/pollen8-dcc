import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCategories } from "@/services/rel8t/contactService";
import { supabase } from "@/integrations/supabase/client";

interface BulkCategorizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onSubmit: (updates: { category_id?: string; industry?: string }) => void;
}

export function BulkCategorizeDialog({
  open,
  onOpenChange,
  selectedCount,
  onSubmit,
}: BulkCategorizeDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [industries, setIndustries] = useState<string[]>([]);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  // Fetch industries from lexicon
  useEffect(() => {
    const fetchIndustries = async () => {
      const { data, error } = await supabase
        .from("lexicon")
        .select("term")
        .eq("term_type", "industry")
        .eq("is_active", true)
        .order("term");

      if (!error && data) {
        setIndustries(data.map((item) => item.term));
      }
    };

    if (open) {
      fetchIndustries();
    }
  }, [open]);

  const handleSubmit = () => {
    const updates: { category_id?: string; industry?: string } = {};
    
    if (selectedCategory && selectedCategory !== "none") {
      updates.category_id = selectedCategory;
    }
    
    if (selectedIndustry && selectedIndustry !== "none") {
      updates.industry = selectedIndustry;
    }

    // Only submit if at least one field is selected
    if (Object.keys(updates).length > 0) {
      onSubmit(updates);
      // Reset selections
      setSelectedCategory("");
      setSelectedIndustry("");
    }
  };

  const handleCancel = () => {
    setSelectedCategory("");
    setSelectedIndustry("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-sm bg-card/80 border-primary/20">
        <DialogHeader>
          <DialogTitle>Categorize {selectedCount} Contact(s)</DialogTitle>
          <DialogDescription>
            Update category and industry for selected contacts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No change</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Industry Selection */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No change</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Info Message */}
          <p className="text-sm text-muted-foreground">
            Only selected fields will be updated. "No change" selections won't modify existing values.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedCategory && !selectedIndustry || 
                     (selectedCategory === "none" && selectedIndustry === "none")}
          >
            Update Contacts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
