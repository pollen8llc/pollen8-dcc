import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shell } from "@/components/layout/Shell";
import { A10DNavigation } from "@/components/a10d/A10DNavigation";
import { ExternalLink, Zap } from "lucide-react";

const integrationOptions = [
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    description: 'Ticketing, RSVPs, venues',
    category: 'Ticketing & Events',
    color: 'from-orange-500/30 to-orange-600/30 border-orange-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'luma',
    name: 'Luma',
    description: 'Community-first events + RSVPs, waitlists',
    category: 'Community Events',
    color: 'from-purple-500/30 to-purple-600/30 border-purple-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'meetup',
    name: 'Meetup',
    description: 'Groups, events, RSVPs',
    category: 'Community Events',
    color: 'from-red-500/30 to-red-600/30 border-red-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'ticketmaster',
    name: 'Ticketmaster',
    description: 'Large-scale ticketing & discovery',
    category: 'Ticketing & Events',
    color: 'from-blue-500/30 to-blue-600/30 border-blue-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'universe',
    name: 'Universe',
    description: 'Ticketing API by Ticketmaster',
    category: 'Ticketing & Events',
    color: 'from-indigo-500/30 to-indigo-600/30 border-indigo-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'splashthat',
    name: 'SplashThat',
    description: 'Guest lists, registrations, event data',
    category: 'Event Management',
    color: 'from-cyan-500/30 to-cyan-600/30 border-cyan-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'bevy',
    name: 'Bevy',
    description: 'Community-led events, chapters',
    category: 'Community Events',
    color: 'from-green-500/30 to-green-600/30 border-green-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'hopin',
    name: 'Hopin',
    description: 'Hybrid/virtual conferences, analytics',
    category: 'Conference & Summit',
    color: 'from-pink-500/30 to-pink-600/30 border-pink-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'airmeet',
    name: 'Airmeet',
    description: 'Conferences, webinars, expos',
    category: 'Conference & Summit',
    color: 'from-sky-500/30 to-sky-600/30 border-sky-500/50',
    status: 'Coming Soon'
  },
  {
    id: 'bizzabo',
    name: 'Bizzabo',
    description: 'Enterprise conference management',
    category: 'Conference & Summit',
    color: 'from-slate-500/30 to-slate-600/30 border-slate-500/50',
    status: 'Coming Soon'
  }
];

const categories = Array.from(new Set(integrationOptions.map(option => option.category)));

export default function A10DImport() {
  const handleConnect = (integrationId: string) => {
    // TODO: Implement connection logic for each integration
    console.log(`Connecting to ${integrationId}`);
  };

  return (
    <Shell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation */}
          <A10DNavigation />
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Import Contacts
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect your event platforms to automatically import attendees and build your community database
            </p>
          </div>

          {/* Categories */}
          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                {category}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrationOptions
                  .filter(option => option.category === category)
                  .map((option) => (
                    <Card 
                      key={option.id}
                      className={`group hover:scale-102 transition-all duration-300 hover:shadow-lg border-0 
                                  bg-gradient-to-r ${option.color} backdrop-blur-md border`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{option.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {option.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {option.status}
                            </Badge>
                          </div>
                          
                          <Button
                            onClick={() => handleConnect(option.id)}
                            disabled={option.status === 'Coming Soon'}
                            size="sm"
                            variant={option.status === 'Coming Soon' ? 'outline' : 'default'}
                          >
                            {option.status === 'Coming Soon' ? (
                              'Soon'
                            ) : (
                              <>
                                Connect
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Footer Note */}
          <div className="text-center mt-16 p-6 rounded-xl bg-muted/50 backdrop-blur-sm">
            <p className="text-muted-foreground">
              More integrations coming soon. Have a specific platform in mind?{" "}
              <Button variant="link" className="p-0 h-auto text-primary">
                Let us know
              </Button>
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}