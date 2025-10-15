import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Navbar from '@/components/Navbar';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';
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

        {/* Managed Communities */}
        {hasUserCommunities && (
          <Collapsible open={isPanelOpen} onOpenChange={setIsPanelOpen}>
            <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                        {isPanelOpen ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <div className="flex-1">
                      <CardTitle>Managed Communities</CardTitle>
                      <CardDescription>
                        {isSelectionMode 
                          ? `${selectedCommunities.length} selected`
                          : 'Communities you organize and manage'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelectionMode ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSelectAll}
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
                </div>
              </CardHeader>
              
              <CollapsibleContent className="animate-accordion-down data-[state=closed]:animate-accordion-up">
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {userCommunities.map((community) => {
                      const isSelected = selectedCommunities.includes(community.id);
                      return (
                        <div 
                          key={community.id} 
                          className={`group relative overflow-hidden rounded-lg border bg-card/60 backdrop-blur-sm p-3 transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'border-primary/60 bg-primary/5 shadow-md shadow-primary/10' 
                              : 'border-border/50 hover:border-primary/30 hover:shadow-md'
                          }`}
                          onClick={() => isSelectionMode && toggleCommunitySelection(community.id)}
                        >
                          <div className="flex items-start gap-3">
                            {isSelectionMode && (
                              <div className="pt-1">
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={() => toggleCommunitySelection(community.id)}
                                  className="h-5 w-5"
                                />
                              </div>
                            )}
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                              {community.logo_url ? (
                                <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover" />
                              ) : (
                                <Users className="h-6 w-6 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm text-foreground truncate">{community.name}</h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {community.type || community.community_type}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {community.location || 'Remote'}
                              </p>
                              <Badge 
                                variant={community.is_public ? 'default' : 'secondary'} 
                                className="mt-1.5 text-xs py-0 h-5"
                              >
                                {community.is_public ? 'Public' : 'Private'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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