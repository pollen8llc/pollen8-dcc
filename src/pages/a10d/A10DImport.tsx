import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shell } from "@/components/layout/Shell";
import { ExternalLink, Zap } from "lucide-react";

const integrationOptions = [
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    description: 'Ticketing, RSVPs, venues',
    category: 'Ticketing & Events',
    logo: '🎫',
    color: 'bg-orange-500/20 text-orange-500',
    status: 'Coming Soon'
  },
  {
    id: 'luma',
    name: 'Luma',
    description: 'Community-first events + RSVPs, waitlists',
    category: 'Community Events',
    logo: '🌟',
    color: 'bg-purple-500/20 text-purple-500',
    status: 'Coming Soon'
  },
  {
    id: 'meetup',
    name: 'Meetup',
    description: 'Groups, events, RSVPs',
    category: 'Community Events',
    logo: '👥',
    color: 'bg-red-500/20 text-red-500',
    status: 'Coming Soon'
  },
  {
    id: 'ticketmaster',
    name: 'Ticketmaster',
    description: 'Large-scale ticketing & discovery',
    category: 'Ticketing & Events',
    logo: '🎪',
    color: 'bg-blue-500/20 text-blue-500',
    status: 'Coming Soon'
  },
  {
    id: 'universe',
    name: 'Universe',
    description: 'Ticketing API by Ticketmaster',
    category: 'Ticketing & Events',
    logo: '🌌',
    color: 'bg-indigo-500/20 text-indigo-500',
    status: 'Coming Soon'
  },
  {
    id: 'splashthat',
    name: 'SplashThat',
    description: 'Guest lists, registrations, event data',
    category: 'Event Management',
    logo: '💧',
    color: 'bg-cyan-500/20 text-cyan-500',
    status: 'Coming Soon'
  },
  {
    id: 'bevy',
    name: 'Bevy',
    description: 'Community-led events, chapters',
    category: 'Community Events',
    logo: '🏠',
    color: 'bg-green-500/20 text-green-500',
    status: 'Coming Soon'
  },
  {
    id: 'hopin',
    name: 'Hopin',
    description: 'Hybrid/virtual conferences, analytics',
    category: 'Conference & Summit',
    logo: '🎬',
    color: 'bg-pink-500/20 text-pink-500',
    status: 'Coming Soon'
  },
  {
    id: 'airmeet',
    name: 'Airmeet',
    description: 'Conferences, webinars, expos',
    category: 'Conference & Summit',
    logo: '✈️',
    color: 'bg-sky-500/20 text-sky-500',
    status: 'Coming Soon'
  },
  {
    id: 'bizzabo',
    name: 'Bizzabo',
    description: 'Enterprise conference management',
    category: 'Conference & Summit',
    logo: '🏢',
    color: 'bg-slate-500/20 text-slate-500',
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrationOptions
                  .filter(option => option.category === category)
                  .map((option) => (
                    <Card 
                      key={option.id}
                      className="group hover:scale-105 transition-all duration-300 hover:shadow-xl border-0 bg-card/60 backdrop-blur-md"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Logo */}
                          <div className="text-6xl mb-2">
                            {option.logo}
                          </div>
                          
                          {/* Name & Description */}
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{option.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {option.description}
                            </p>
                          </div>

                          {/* Status Badge */}
                          <Badge variant="outline" className="mb-4">
                            {option.status}
                          </Badge>

                          {/* Connect Button */}
                          <Button
                            onClick={() => handleConnect(option.id)}
                            disabled={option.status === 'Coming Soon'}
                            className="w-full"
                            variant={option.status === 'Coming Soon' ? 'outline' : 'default'}
                          >
                            {option.status === 'Coming Soon' ? (
                              'Coming Soon'
                            ) : (
                              <>
                                Connect
                                <ExternalLink className="w-4 h-4 ml-2" />
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