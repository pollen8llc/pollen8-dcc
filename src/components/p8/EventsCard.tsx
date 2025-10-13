import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

// Sample events data
const events = [
  { 
    id: 1,
    title: 'Tech Innovators Meetup',
    date: new Date('2024-12-20'),
    attendees: 45,
    location: 'New York'
  },
  { 
    id: 2,
    title: 'Startup Founders Summit',
    date: new Date('2024-12-22'),
    attendees: 120,
    location: 'London'
  },
  { 
    id: 3,
    title: 'AI & Machine Learning Workshop',
    date: new Date('2024-12-25'),
    attendees: 67,
    location: 'Tokyo'
  },
  { 
    id: 4,
    title: 'Blockchain Developer Conference',
    date: new Date('2024-12-28'),
    attendees: 89,
    location: 'Dubai'
  },
];

interface EventsCardProps {
  className?: string;
}

const EventsCard = ({ className = '' }: EventsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 via-teal-500/5 to-blue-600/5 backdrop-blur-md shadow-2xl ${className}`}>
      <div className="p-0">
        <div className="relative bg-gradient-to-br from-blue-500/2 via-teal-500/2 to-blue-600/2 p-6 lg:p-8">
          <div className="space-y-6">
                
            {/* Section 1: Header */}
            <div className="flex items-center gap-4">
              {/* Calendar Icon */}
              <div className="shrink-0">
                <div className="w-[105px] h-[105px] rounded-full overflow-hidden bg-background/50 backdrop-blur-sm flex items-center justify-center" style={{ border: '3.84px solid hsl(var(--primary) / 0.2)' }}>
                  <Calendar className="w-14 h-14 text-primary" />
                </div>
              </div>

              {/* Title and Description */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground mb-1">Events</h2>
                <p className="text-sm text-muted-foreground">Upcoming events across your communities</p>
              </div>
            </div>

            {/* Section 2: Events Accordion */}
            <div className="space-y-3">
              {/* Glassmorphic Events Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 bg-gradient-to-r from-teal-500/10 via-aquamarine-500/10 to-teal-500/10 backdrop-blur-xl border border-teal-500/20 rounded-lg hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
                      <p className="text-sm text-muted-foreground">{events.length} events scheduled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-teal-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-teal-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Events List - Notification Style */}
              {isExpanded && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 bg-background/60 rounded-lg hover:bg-background/80 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group"
                    >
                      {/* Left side: Event info */}
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse group-hover:bg-teal-300 transition-colors mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium group-hover:text-teal-100 transition-colors truncate">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground group-hover:text-teal-200 transition-colors flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(event.date, 'MMM dd, yyyy')}
                            </span>
                            <Badge variant="tag" className="text-xs">
                              {event.location}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Attendee count */}
                      <div className="flex items-center space-x-2 ml-4 shrink-0">
                        <Users className="w-4 h-4 text-muted-foreground group-hover:text-teal-300 transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-teal-200 transition-colors">
                          {event.attendees}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>
  );
};

export default EventsCard;
