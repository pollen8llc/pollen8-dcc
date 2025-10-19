import Navbar from "@/components/Navbar";
import { Cultiva8OnlyNavigation } from "@/components/knowledge/Cultiva8OnlyNavigation";

export function KnowledgeHeader() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <Cultiva8OnlyNavigation />
      </div>
    </div>
  );
}
