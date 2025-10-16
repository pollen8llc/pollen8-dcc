import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Navbar from '@/components/Navbar';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';
import CompactCommunityCard from '@/components/eco8/CompactCommunityCard';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';

import { 
  Users,
  Plus,
  Eye,
  AlertCircle,
  Edit,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  X
} from 'lucide-react';

const Eco8Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userCommunities, hasUserCommunities, loading } = useCommunities();
  const { currentUser } = useAuth();
  const { eco8_complete, loading: completionLoading } = useModuleCompletion();

  // State management
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Check ECO8 setup status - only use database state
  React.useEffect(() => {
    if (!completionLoading && eco8_complete === false) {
      navigate("/eco8/setup");
    }
  }, [completionLoading, eco8_complete, navigate]);

  // Selection functions
  const toggleCommunitySelection = (id: string) => {
    setSelectedCommunities(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCommunities.length === userCommunities.length) {
      setSelectedCommunities([]);
    } else {
      setSelectedCommunities(userCommunities.map(c => c.id));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedCommunities([]);
    }
  };

  // Debug logging
  console.log('Eco8Dashboard - Current user:', currentUser?.id);
  console.log('Eco8Dashboard - User communities:', userCommunities);
  console.log('Eco8Dashboard - Has user communities:', hasUserCommunities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Navigation Component */}
        <Eco8Navigation hasUserCommunities={hasUserCommunities} />

        {/* Page Title - Minimal Design */}
        <div className="flex items-center gap-3 mb-6 mt-6">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <p className="text-muted-foreground">Manage and grow your community network</p>
          </div>
        </div>

        {/* Setup Prompt if no communities */}
        {!loading && !hasUserCommunities && (
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md border-2 border-dashed border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to ECO8!</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                You haven't created any communities yet. Start building your network by creating your first community.
              </p>
              <Link to="/eco8/setup">
                <Button size="lg" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your First Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Communities Accordion */}
        {hasUserCommunities && (
          <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen} className="mt-6">
            <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              
              <CollapsibleTrigger asChild>
                <CardHeader className="relative cursor-pointer hover:bg-card/60 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="transition-transform duration-200">
                        {isPanelOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold">Communities</CardTitle>
                        <CardDescription className="text-sm">
                          {isSelectionMode 
                            ? `${selectedCommunities.length} selected`
                            : `${userCommunities.length} ${userCommunities.length === 1 ? 'community' : 'communities'}`
                          }
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="relative animate-accordion-down data-[state=closed]:animate-accordion-up">
                <CardContent className="pt-0">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 mb-6 pb-4 border-b border-border/50">
                    {isSelectionMode ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSelectAll}
                          className="backdrop-blur-sm"
                        >
                          {selectedCommunities.length === userCommunities.length ? (
                            <>
                              <Square className="h-4 w-4 mr-2" />
                              Deselect All
                            </>
                          ) : (
                            <>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Select All
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={toggleSelectionMode}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={toggleSelectionMode}
                          className="backdrop-blur-sm"
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Select
                        </Button>
                        <Link to="/eco8/setup">
                          <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Community Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userCommunities.map((community) => (
                      <CompactCommunityCard
                        key={community.id}
                        community={community}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedCommunities.includes(community.id)}
                        onToggleSelection={toggleCommunitySelection}
                      />
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Community Metrics */}
        {hasUserCommunities && (
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md mt-8">
            <CardHeader>
              <CardTitle>Community Metrics</CardTitle>
              <CardDescription>
                {selectedCommunities.length > 0 ? (
                  <span>
                    Showing metrics for {selectedCommunities.length} selected {selectedCommunities.length === 1 ? 'community' : 'communities'}
                  </span>
                ) : (
                  'Overview of all your communities'
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-muted-foreground">Total Members</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">5,678</p>
                    <p className="text-xs text-muted-foreground">Profile Views</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-muted-foreground">Engagement Rate</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">+156</p>
                    <p className="text-xs text-muted-foreground">New This Month</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">847</p>
                    <p className="text-xs text-muted-foreground">Active Members</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">3.2k</p>
                    <p className="text-xs text-muted-foreground">Monthly Visits</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <Edit className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">234</p>
                    <p className="text-xs text-muted-foreground">Updates Posted</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Eco8Dashboard;