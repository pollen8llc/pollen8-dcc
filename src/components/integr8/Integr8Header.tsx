import Navbar from "@/components/Navbar";
import { Integr8OnlyNavigation } from "@/components/integr8/Integr8OnlyNavigation";

export function Integr8Header() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <Integr8OnlyNavigation />
      </div>
    </div>
  );
}
