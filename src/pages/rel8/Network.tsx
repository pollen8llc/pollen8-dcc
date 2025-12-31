import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useActv8Contacts, Actv8ContactDisplay } from "@/hooks/useActv8Contacts";
import { NetworkFilters } from "@/components/rel8t/network/NetworkFilters";
import { NetworkContactCard } from "@/components/rel8t/network/NetworkContactCard";
import { Actv8EmptyState } from "@/components/rel8t/network/Actv8EmptyState";
import { OutreachSection } from "@/components/rel8t/dashboard/OutreachSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import Navbar from "@/components/Navbar";
import { Plus, BarChart3, Loader2, Zap, Users, CalendarCheck } from "lucide-react";

export default function Network() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading contacts...</p>
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="empty-state h-[60vh]">
          <div className="empty-state-icon bg-destructive/20">
            <Zap className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-muted-foreground mb-4">Failed to load contacts</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  // Empty state
  if (contacts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-header-title">Actv8</h1>
              <p className="page-header-subtitle">Develop your relationships</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 pb-32">
          <Actv8EmptyState />
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
          <Rel8OnlyNavigation />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header - Android style */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="page-header-title">Actv8</h1>
              <p className="page-header-subtitle">
                {contacts.length} active relationship{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link to="/rel8/actv8/insights">
            <button className="icon-button">
              <BarChart3 className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2 border-b border-border/30">
          <TabsList className="w-full h-12 p-1 bg-muted/50">
            <TabsTrigger value="contacts" className="flex-1 gap-2 data-[state=active]:bg-background">
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex-1 gap-2 data-[state=active]:bg-background">
              <CalendarCheck className="h-4 w-4" />
              <span>Outreach</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="contacts" className="mt-0">
          {/* Filters - Material style chips */}
          <div className="px-4 py-3 border-b border-border/30">
            <NetworkFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedIndustries={selectedIndustries}
              onIndustriesChange={setSelectedIndustries}
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              selectedStrengths={selectedStrengths}
              onStrengthsChange={setSelectedStrengths}
            />
          </div>

          {/* Results count */}
          {(searchQuery || selectedIndustries.length > 0 || selectedTypes.length > 0 || selectedStrengths.length > 0) && (
            <div className="section-header">
              {filteredContacts.length} of {contacts.length} contacts
            </div>
          )}

          {/* Contact List - Android notification style */}
          <div className="px-4 py-2 pb-32 space-y-2">
            {filteredContacts.map(contact => (
              <NetworkContactCard 
                key={contact.id} 
                contact={contact} 
                viewMode="grid"
              />
            ))}

            {filteredContacts.length === 0 && (
              <div className="empty-state py-16">
                <p className="text-muted-foreground">No contacts match your filters</p>
                <Button 
                  variant="ghost" 
                  className="mt-2 text-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                    setSelectedTypes([]);
                    setSelectedStrengths([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* FAB - Add Contact */}
          <Link to="/rel8/contacts" className="md-fab-extended">
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add</span>
          </Link>
        </TabsContent>

        <TabsContent value="outreach" className="mt-0">
          <div className="px-4 py-4 pb-32">
            <OutreachSection />
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
