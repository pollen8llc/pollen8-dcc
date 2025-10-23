import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loc8Dialog } from "@/components/ui/loc8-dialog";

const P8Loc8 = () => {
  const navigate = useNavigate();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in p-2 md:p-4">
        {/* Progress */}
        <div className="flex items-center space-x-2 px-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 2 of 4
          </Badge>
        </div>

        {/* Loc8 Dialog */}
        <Loc8Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          value={selectedCities}
          onValueChange={setSelectedCities}
          mode="multiple"
          title="Select Your Cities"
          description="Choose the cities where you're active or interested in connecting"
          onConfirm={(cities) => {
            setSelectedCities(cities);
            setIsDialogOpen(false);
            if (cities.length > 0) {
              navigate("/p8/asl");
            }
          }}
        />

        {/* Navigation - Sticky on all screens */}
        <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-lg border-t border-primary/10 -mx-2 md:-mx-4 px-4 py-3 mt-4">
          <div className="max-w-7xl mx-auto flex justify-between">
            <Button variant="outline" onClick={() => navigate("/p8")} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
            <Button 
              onClick={() => {
                if (selectedCities.length > 0) {
                  navigate("/p8/asl");
                } else {
                  setIsDialogOpen(true);
                }
              }}
              className="group"
            >
              {selectedCities.length > 0 
                ? `Continue (${selectedCities.length} selected)` 
                : "Select Cities"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P8Loc8;
