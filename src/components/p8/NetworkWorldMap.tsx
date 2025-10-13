import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getContacts, Contact } from "@/services/rel8t/contactService";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Inline SVG Ring Chart Component
const RingChart = () => {
  const totalContacts = 1247;
  const activeConnections = 842;
  const activePercentage = (activeConnections / totalContacts) * 100;
  
  const size = 96;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const activeStrokeDashoffset = circumference - (activePercentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {/* Glassmorphic background circle */}
      <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm" />
      
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Inactive ring (blue) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Active ring (teal with flashing animation) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(20, 184, 166, 0.9)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={activeStrokeDashoffset}
          className="transition-all duration-300"
          style={{
            filter: "drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))",
            animation: "pulse-glow 3s ease-in-out infinite"
          }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold text-[rgba(20,184,166,0.9)]">
          {Math.round(activePercentage)}%
        </div>
        <div className="text-[10px] text-muted-foreground">
          Active
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const NetworkWorldMap = () => {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const navigate = useNavigate();
  
  const totalContacts = 1247;
  const activeConnections = 842;
  const activePercentage = (activeConnections / totalContacts) * 100;
  
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });

  return (
    <div className="w-full">
      <Card className="relative overflow-hidden glass-morphism border-0 backdrop-blur-md" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}>
        <CardContent className="p-0">
          <div className="relative p-6 lg:p-8">

              {/* Content Layout - matches profile card structure */}
              <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                {/* Ring Chart (left) - inline like avatar */}
                <RingChart />

                {/* Network Info (center) - matches profile info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground mb-1">
                    Network
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Social Connection Analysis
                  </p>
                </div>
              </div>

              {/* Categories Section - Always Visible */}
              <div className="relative z-10 mt-4">
                <div className="glass-morphism bg-card/20 backdrop-blur-sm rounded-lg p-4 border-0">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-3">Contact Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <Badge
                        key={category.id}
                        variant="tag"
                        className="px-3 py-1.5 justify-center truncate"
                        style={{ 
                          backgroundColor: `${category.color}20`,
                          borderColor: category.color,
                          color: category.color
                        }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                    {/* Always show 2 blank + slots */}
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 justify-center cursor-pointer hover:bg-card/40 transition-colors"
                    >
                      +
                    </Badge>
                    <Badge
                      variant="outline"
                      className="px-3 py-1.5 justify-center cursor-pointer hover:bg-card/40 transition-colors"
                    >
                      +
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contacts Accordion Section */}
              <div className="relative z-10 mt-4">
                <button
                  onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                  className="w-full glass-morphism bg-card/20 backdrop-blur-sm rounded-full p-1 border-0 hover:bg-card/30 transition-all group"
                >
                  {/* Sleek gradient bar */}
                  <div className="relative h-11 rounded-full overflow-hidden flex items-center">
                    {/* Active segment - darker gradient */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-all duration-500"
                      style={{ 
                        width: `${activePercentage}%`,
                        boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)'
                      }}
                    />
                    {/* Inactive segment - darker */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-blue-700/40"
                      style={{ left: `${activePercentage}%` }}
                    />
                    
                    {/* Content overlay */}
                    <div className="relative w-full flex items-center justify-between px-4 sm:px-5">
                      {/* Left side - Active contacts */}
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-white leading-none">
                            {activeConnections}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wide leading-none">
                            Active
                          </span>
                        </div>
                      </div>
                      
                      {/* Right side - Total contacts + chevron */}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-white leading-none">
                            {totalContacts}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wide leading-none">
                            Total
                          </span>
                        </div>
                        {isCategoriesExpanded ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-y-[-2px] transition-transform" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-y-[2px] transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {isCategoriesExpanded && (
                  <div className="mt-3 glass-morphism bg-card/20 backdrop-blur-sm rounded-lg p-4 border-0 animate-accordion-down space-y-4">
                    {/* Contact Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contacts.slice(0, 8).map((contact) => (
                        <Card
                          key={contact.id}
                          onClick={() => navigate(`/rel8/contacts`)}
                          className="cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm border-2 bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl group relative overflow-hidden"
                        >
                          {/* Gradient border effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                          
                          <CardContent className="p-5 relative z-10">
                            <div className="flex items-center">
                              <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-transparent text-primary font-semibold text-sm">
                                    {contact.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-base truncate group-hover:text-primary transition-colors">
                                  {contact.name}
                                </h3>
                                {contact.category && (
                                  <p className="text-muted-foreground text-sm truncate">
                                    {contact.category.name}
                                  </p>
                                )}
                                {contact.location && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <p className="text-xs text-muted-foreground truncate">{contact.location}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Manage Contacts Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/rel8/contacts");
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      Manage Contacts
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Glowing Sliver */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
      </div>
    </div>
  );
};

export default NetworkWorldMap;
