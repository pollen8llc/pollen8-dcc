import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useActv8Contacts, Actv8ContactDisplay } from "@/hooks/useActv8Contacts";
import { useUser } from "@/contexts/UserContext";
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
import { Plus, Loader2, Zap, Users, Calendar, CalendarCheck, RefreshCw, Bug, Power, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Network() {
  const [searchParams] = useSearchParams();
  const { currentUser } = useUser();
  const queryClient = useQueryClient();
  
  // Support both ?tab=outreach and ?task for back navigation
  const tabParam = searchParams.get('tab');
  const hasTaskFlag = searchParams.has('task');
  const hasDebugFlag = searchParams.has('debug');
  const initialTab = hasTaskFlag ? 'outreach' : (tabParam || 'contacts');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { data: contacts = [], isLoading, error, refetch } = useActv8Contacts();
  
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

  // Force refresh handler
  const handleForceRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
    refetch();
  };

  // Reactivate all inactive contacts
  const handleReactivateAll = async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("rms_actv8_contacts")
        .update({ status: "active", activated_at: new Date().toISOString() })
        .eq("user_id", currentUser.id)
        .eq("status", "inactive")
        .select();
      
      if (error) throw error;
      
      toast.success(`Reactivated ${data?.length || 0} contacts`);
      queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
      refetch();
    } catch (err) {
      console.error('[Actv8] Reactivate all error:', err);
      toast.error('Failed to reactivate contacts');
    }
  };

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
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-6xl pointer-events-auto">
            <Rel8OnlyNavigation />
          </div>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-6xl pointer-events-auto">
            <Rel8OnlyNavigation />
          </div>
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
          <Link to="/rel8/triggers">
            <Button variant="ghost" size="icon" className="rounded-full text-teal-500 hover:text-teal-400">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Debug Panel - only shown with ?debug query param */}
        {hasDebugFlag && (
          <Card className="mb-4 border-amber-500/50 bg-amber-500/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="h-4 w-4 text-amber-500" />
                <span className="font-semibold text-amber-500">Debug Info</span>
              </div>
              <div className="text-xs font-mono space-y-1">
                <p><strong>User ID:</strong> {currentUser?.id || 'Not logged in'}</p>
                <p><strong>Contacts loaded:</strong> {contacts.length}</p>
                <p><strong>Query error:</strong> {error?.message || 'None'}</p>
                <p><strong>Is loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleForceRefresh}
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Force Refresh
                </Button>
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={handleReactivateAll}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Power className="h-3 w-3 mr-2" />
                  Reactivate All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs - Button Style */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${
                activeTab === 'contacts'
                  ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                  : 'bg-card/60 border-border/50 text-muted-foreground hover:bg-card/80 hover:border-primary/30'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Connects</span>
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${
                activeTab === 'outreach'
                  ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20 ring-2 ring-primary/20'
                  : 'bg-card/60 border-border/50 text-muted-foreground hover:bg-card/80 hover:border-primary/30'
              }`}
            >
              <CalendarCheck className="h-5 w-5" />
              <span>Outreach</span>
              {pendingOutreachCount > 0 && (
                <span className="relative ml-1 inline-flex">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-primary opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold items-center justify-center shadow-lg shadow-primary/50 border-2 border-primary/50">
                    {pendingOutreachCount > 9 ? '9+' : pendingOutreachCount}
                  </span>
                </span>
              )}
            </button>
          </div>

          <TabsContent value="contacts" className="mt-0">
            {contacts.length === 0 ? (
              renderEmptyContactsState()
            ) : (
              <>
                {/* Filters Card */}
                <Card className="bg-card/60 backdrop-blur-xl border-primary/20 mb-6">
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
                    <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
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
            <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
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
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
}
