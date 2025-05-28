
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import ContactGroupsEdit from "@/components/rel8t/ContactGroupsEdit";

const Groups = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="mt-6">
          <ContactGroupsEdit />
        </div>
      </div>
    </div>
  );
};

export default Groups;
