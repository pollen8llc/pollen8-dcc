import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

interface Rel8HeaderProps {
  showProfileBanner?: boolean;
}

export function Rel8Header({ showProfileBanner = true }: Rel8HeaderProps) {
  return (
    <div className="w-full">
      <Navbar />
      {showProfileBanner && <DotConnectorHeader />}
      <div className="container mx-auto px-4 py-4">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}