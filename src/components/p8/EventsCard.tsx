import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

// Sample events data - mix of upcoming and previous
const events = [{
  id: 1,
  title: 'Tech Innovators Meetup',
  date: new Date('2024-12-20'),
  attendees: 45,
  location: 'New York',
  status: 'upcoming'
}, {
  id: 2,
  title: 'Startup Founders Summit',
  date: new Date('2024-12-22'),
  attendees: 120,
  location: 'London',
  status: 'upcoming'
}, {
  id: 3,
  title: 'AI & Machine Learning Workshop',
  date: new Date('2024-12-25'),
  attendees: 67,
  location: 'Tokyo',
  status: 'upcoming'
}, {
  id: 4,
  title: 'Blockchain Developer Conference',
  date: new Date('2024-12-28'),
  attendees: 89,
  location: 'Dubai',
  status: 'upcoming'
}, {
  id: 5,
  title: 'Web3 Summit',
  date: new Date('2025-01-05'),
  attendees: 156,
  location: 'Singapore',
  status: 'upcoming'
}, {
  id: 6,
  title: 'DevOps Masters Workshop',
  date: new Date('2025-01-10'),
  attendees: 78,
  location: 'San Francisco',
  status: 'upcoming'
}, {
  id: 7,
  title: 'Cloud Computing Conference',
  date: new Date('2024-11-15'),
  attendees: 203,
  location: 'Seattle',
  status: 'previous'
}, {
  id: 8,
  title: 'Mobile App Development Meetup',
  date: new Date('2024-11-20'),
  attendees: 92,
  location: 'Austin',
  status: 'previous'
}];
const EVENTS_PER_PAGE = 4;
interface EventsCardProps {
  className?: string;
}
const EventsCard = ({
  className = ''
}: EventsCardProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const startIndex = currentPage * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = events.slice(startIndex, endIndex);
  const minSwipeDistance = 50;
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNextPage();
    }
    if (isRightSwipe) {
      goToPreviousPage();
    }
  };
  return <Card className={`overflow-hidden border-0 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all shadow-2xl ${className}`} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="p-0">
        <div className="relative bg-gradient-to-br from-white/2 via-white/1 to-white/2 p-6 lg:p-8">
          <div className="space-y-6">

            {/* Header with Navigation */}
            <div className="space-y-3">
              {/* Glassmorphic Header with Navigation */}
              <div className="w-full p-4 bg-gradient-to-r from-teal-500/10 via-aquamarine-500/10 to-teal-500/10 backdrop-blur-xl border border-teal-500/20 rounded-lg">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Arrow */}
                  <Button variant="ghost" size="icon" onClick={goToPreviousPage} disabled={currentPage === 0} className="h-10 w-10 shrink-0 text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  
                  {/* Center Content */}
                  <div className="flex items-center justify-center space-x-3 flex-1">
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground">Latest Events</h3>
                      <p className="text-sm text-muted-foreground">{events.length} total events</p>
                    </div>
                  </div>
                  
                  {/* Right Arrow */}
                  <Button variant="ghost" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages - 1} className="h-10 w-10 shrink-0 text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Events List - Always Visible */}
              <div className="space-y-2 animate-fade-in">
                {currentEvents.map(event => <div key={event.id} className="flex items-center justify-between p-4 bg-background/60 rounded-lg hover:bg-background/80 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group">
                    {/* Left side: Event info */}
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${event.status === 'upcoming' ? 'bg-teal-400 animate-pulse' : 'bg-muted-foreground/50'} group-hover:bg-teal-300 transition-colors mt-1.5`} />
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
                  </div>)}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>;
};
export default EventsCard;