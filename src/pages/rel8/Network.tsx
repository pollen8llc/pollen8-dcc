import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useActv8Contacts, Actv8ContactDisplay } from "@/hooks/useActv8Contacts";
import { NetworkFilters } from "@/components/rel8t/network/NetworkFilters";
import { NetworkContactCard } from "@/components/rel8t/network/NetworkContactCard";
import { Actv8EmptyState } from "@/components/rel8t/network/Actv8EmptyState";
import OutreachList from "@/components/rel8t/OutreachList";
import { getOutreachStatusCounts } from "@/services/rel8t/outreachService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import Navbar from "@/components/Navbar";
import { Plus, BarChart3, Loader2, Zap, Users, Calendar, CalendarCheck } from "lucide-react";

export default function Network() {
  const [searchParams] = useSearchParams();
  // Support both ?tab=outreach and ?task for back navigation
  const tabParam = searchParams.get('tab');
  const hasTaskFlag = searchParams.has('task');
  const initialTab = hasTaskFlag ? 'outreach' : (tabParam || 'contacts');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: contacts = [], isLoading, error } = useActv8Contacts();
  
  // Get outreach counts for notification dot
  const { data: outreachCounts = { today: 0, upcoming: 0, overdue: 0, completed: 0 } } = useQuery({
    queryKey: ["outreach-counts"],
    queryFn: getOutreachStatusCounts,
    staleTime: 1000 * 60,
  });
  
  const pendingOutreachCount = outreachCounts.today + outreachCounts.overdue;
  
  // Update tab when URL param changes
  useEffect(() => {
    if (searchParams.get('tab') === 'outreach') {
      setActiveTab('outreach');
    }
  }, [searchParams]);

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
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

  // Empty state for contacts tab (but still show outreach tab)
  const renderEmptyContactsState = () => (
    <div className="px-4 py-6 pb-32">
      <Actv8EmptyState />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Actv8</h1>
              <p className="text-sm text-muted-foreground">
                {contacts.length} active relationship{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link to="/rel8/actv8/insights">
            <Button variant="ghost" size="icon" className="rounded-full">
              <BarChart3 className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-12 p-1 bg-muted/50 backdrop-blur-sm mb-6">
            <TabsTrigger value="contacts" className="flex-1 gap-2 data-[state=active]:bg-background">
              <Users className="h-4 w-4" />
              <span>Connects</span>
            </TabsTrigger>
            <TabsTrigger value="outreach" className="flex-1 gap-2 data-[state=active]:bg-background">
              <CalendarCheck className="h-4 w-4" />
              <span>Outreach</span>
              {pendingOutreachCount > 0 && (
                <span className="relative ml-2 inline-flex">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-teal-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xs font-bold items-center justify-center shadow-lg shadow-teal-500/50 border-2 border-teal-300">
                    {pendingOutreachCount > 9 ? '9+' : pendingOutreachCount}
                  </span>
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-0">
            {contacts.length === 0 ? (
              renderEmptyContactsState()
            ) : (
              <>
                {/* Filters Card */}
                <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md mb-6">
                  <CardContent className="p-4">
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
                  </CardContent>
                </Card>

                {/* Results count */}
                {(searchQuery || selectedIndustries.length > 0 || selectedTypes.length > 0 || selectedStrengths.length > 0) && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {filteredContacts.length} of {contacts.length} contacts
                  </p>
                )}

                {/* Contact Grid - 2 columns on desktop, 1 on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContacts.map(contact => (
                    <NetworkContactCard 
                      key={contact.id} 
                      contact={contact} 
                      viewMode="grid"
                    />
                  ))}

                  {filteredContacts.length === 0 && (
                    <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-3">No contacts match your filters</p>
                        <Button 
                          variant="ghost" 
                          className="text-primary"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedIndustries([]);
                            setSelectedTypes([]);
                            setSelectedStrengths([]);
                          }}
                        >
                          Clear filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* FAB - Add Contact */}
                <Link to="/rel8/contacts" className="md-fab-extended">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">Add</span>
                </Link>
              </>
            )}
          </TabsContent>

          <TabsContent value="outreach" className="mt-0">
            {/* Outreach Tasks Card - matching /rel8 Dashboard style */}
            <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md">
              <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Outreach Tasks</h3>
                  </div>
                  <Button 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
                    size="sm"
                    variant={isCalendarOpen ? "default" : "outline"}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {isCalendarOpen ? "Hide Calendar" : "Search by Date"}
                  </Button>
                </div>
              </div>
              <CardContent className="pt-6">
                <OutreachList showCalendar={isCalendarOpen} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
