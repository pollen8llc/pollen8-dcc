import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, Phone, MapPin } from "lucide-react";
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
                  <div className="relative h-12 sm:h-11 rounded-full overflow-hidden">
                    {/* Active segment */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 shadow-lg"
                      style={{ 
                        width: `${activePercentage}%`,
                        boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)'
                      }}
                    />
                    {/* Inactive segment */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-600/20"
                      style={{ left: `${activePercentage}%` }}
                    />
                    
                    {/* Content overlay */}
                    <div className="relative h-full flex items-center justify-between px-4 sm:px-5">
                      {/* Left side - Active contacts */}
                      <div className="flex items-center gap-2 h-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-lg" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-white leading-none" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.8)' }}>
                            {activeConnections}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wide leading-none" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.8)' }}>
                            Active
                          </span>
                        </div>
                      </div>
                      
                      {/* Right side - Total contacts + chevron */}
                      <div className="flex items-center gap-2 sm:gap-3 h-full">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-white leading-none" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.8)' }}>
                            {totalContacts}
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-white uppercase tracking-wide leading-none" style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.8)' }}>
                            Total
                          </span>
                        </div>
                        {isCategoriesExpanded ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg group-hover:translate-y-[-2px] transition-transform" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg group-hover:translate-y-[2px] transition-transform" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>

                {isCategoriesExpanded && (
                  <div className="mt-3 glass-morphism bg-card/20 backdrop-blur-sm rounded-lg p-4 border-0 animate-accordion-down">
                    {/* Contact Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {contacts.slice(0, 8).map((contact) => (
                        <Card
                          key={contact.id}
                          className="glass-morphism border-0 bg-card/20 backdrop-blur-sm hover:bg-card/30 transition-all cursor-pointer group"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-12 w-12 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                  {contact.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                  {contact.name}
                                </h3>
                                
                                {contact.organization && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {contact.organization}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                  {contact.email && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      <span className="truncate max-w-[100px]">{contact.email}</span>
                                    </div>
                                  )}
                                  {contact.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{contact.location}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {contact.category && (
                                  <Badge
                                    variant="tag"
                                    className="mt-2 px-2 py-0.5 text-xs"
                                    style={{ 
                                      backgroundColor: `${contact.category.color}20`,
                                      borderColor: contact.category.color,
                                      color: contact.category.color
                                    }}
                                  >
                                    {contact.category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Manage Contacts Button */}
              <div className="relative z-10 mt-4">
                <Button
                  onClick={() => navigate("/rel8/contacts")}
                  className="w-full"
                  variant="outline"
                >
                  Manage Contacts
                </Button>
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
