
import Navbar from "@/components/Navbar";
import { ContactGroupsManager } from "@/components/rel8t/ContactGroupsManager";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const Groups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Groups</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Organize your contacts into groups</p>
          </div>
        </div>

        <ContactGroupsManager />
      </div>
    </div>
  );
};

export default Groups;
