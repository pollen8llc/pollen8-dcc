import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useActv8Contacts, Actv8ContactDisplay } from "@/hooks/useActv8Contacts";
import { NetworkFilters } from "@/components/rel8t/network/NetworkFilters";
import { NetworkContactCard } from "@/components/rel8t/network/NetworkContactCard";
import { Actv8EmptyState } from "@/components/rel8t/network/Actv8EmptyState";
import { Button } from "@/components/ui/button";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import Navbar from "@/components/Navbar";
import { UserPlus, Upload, BarChart3, Loader2 } from "lucide-react";

export default function Network() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: contacts = [], isLoading, error } = useActv8Contacts();

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = !searchQuery || 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesIndustry = selectedIndustries.length === 0 || 
        selectedIndustries.includes(contact.industry);
      
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.includes(contact.relationshipType);
      
      const matchesStrength = selectedStrengths.length === 0 || 
        selectedStrengths.includes(contact.connectionStrength);
      
      return matchesSearch && matchesIndustry && matchesType && matchesStrength;
    });
  }, [contacts, searchQuery, selectedIndustries, selectedTypes, selectedStrengths]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <DotConnectorHeader />
        <div className="container max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <DotConnectorHeader />
        <div className="container max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-destructive mb-4">Failed to load contacts</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <DotConnectorHeader />
        <div className="container max-w-7xl mx-auto px-4 py-6 pb-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Actv8</h1>
              <p className="text-muted-foreground">
                Intentionally develop your professional relationships
              </p>
            </div>
          </div>
          <Actv8EmptyState />
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />
      <div className="container max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Actv8</h1>
            <p className="text-muted-foreground">
              Intentionally develop your professional relationships
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/rel8/actv8/insights">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Insights
              </Button>
            </Link>
            <Link to="/rel8/contacts">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <NetworkFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustries={selectedIndustries}
            onIndustriesChange={setSelectedIndustries}
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
            selectedStrengths={selectedStrengths}
            onStrengthsChange={setSelectedStrengths}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredContacts.length} of {contacts.length} activated contacts
        </p>

        {/* Contact Grid/List */}
        <div className="space-y-4">
          {filteredContacts.map(contact => (
            <NetworkContactCard 
              key={contact.id} 
              contact={contact} 
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No contacts match your filters</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
