import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

interface Rel8HeaderProps {
  showProfileBanner?: boolean;
}

export function Rel8Header({ showProfileBanner = false }: Rel8HeaderProps) {
  return (
    <>
      <div className="w-full">
        <Navbar />
        {showProfileBanner && <DotConnectorHeader />}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </>
  );
}