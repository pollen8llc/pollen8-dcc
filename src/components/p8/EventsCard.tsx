import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
const EVENTS_PER_PAGE = 3;
interface EventsCardProps {
  className?: string;
}
// Event platform badges
const eventPlatforms = [
  { name: 'Luma', color: '#9333ea' },
  { name: 'Eventbrite', color: '#f97316' },
  { name: 'Meetup', color: '#ef4444' },
];

const EventsCard = ({
  className = ''
}: EventsCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);
  const minSwipeDistance = 50;
  
  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || !isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= totalPages - 1) {
          return 0; // Loop back to first page
        }
        return prev + 1;
      });
    }, 4000); // Rotate every 4 seconds
    
    return () => clearInterval(interval);
  }, [autoRotate, isOpen, totalPages]);
  
  const goToNextPage = () => {
    setAutoRotate(false);
    setIsTransitioning(true);
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(0);
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  const goToPreviousPage = () => {
    setAutoRotate(false);
    setIsTransitioning(true);
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(totalPages - 1);
    }
    setTimeout(() => setIsTransitioning(false), 300);
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
    
    if (isLeftSwipe || isRightSwipe) {
      setAutoRotate(false);
      setIsTransitioning(true);
    }
    
    if (isLeftSwipe) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      } else {
        setCurrentPage(0);
      }
    }
    if (isRightSwipe) {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        setCurrentPage(totalPages - 1);
      }
    }
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setAutoRotate(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - dragStart;
    setDragOffset(diff);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      setIsTransitioning(true);
      if (dragOffset < 0) {
        // Dragged left - go to next
        if (currentPage < totalPages - 1) {
          setCurrentPage(currentPage + 1);
        } else {
          setCurrentPage(0);
        }
      } else {
        // Dragged right - go to previous
        if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          setCurrentPage(totalPages - 1);
        }
      }
      setTimeout(() => setIsTransitioning(false), 300);
    }
    
    setDragOffset(0);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
    }
  };
  return <Card className={`relative overflow-hidden glass-morphism border-0 backdrop-blur-md transition-all ${className}`} style={{ background: 'linear-gradient(to bottom, rgba(20, 184, 166, 0.08), rgba(59, 130, 246, 0.08))' }}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-0">
          <div className="relative p-6 lg:p-8 pb-0">
            <div className="space-y-6">

              {/* Header with Navigation Only */}
              <div className="space-y-3">
                {/* Glassmorphic Header with Navigation */}
                <div className="w-full p-4 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-teal-500/20 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Arrow */}
                    <Button variant="ghost" size="icon" onClick={goToPreviousPage} className="h-10 w-10 shrink-0 text-teal-400 hover:text-teal-300 hover:bg-teal-500/20">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    
                    {/* Center Content */}
                    <div className="flex flex-col items-center justify-center space-y-2 flex-1">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground">Latest Events</h3>
                        <p className="text-sm text-muted-foreground">{events.length} total events</p>
                      </div>
                      {/* Page indicators */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentPage(idx);
                              setAutoRotate(false);
                            }}
                            className={`h-1.5 rounded-full transition-all ${
                              idx === currentPage 
                                ? 'w-6 bg-teal-400' 
                                : 'w-1.5 bg-teal-400/30 hover:bg-teal-400/50'
                            }`}
                            aria-label={`Go to page ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right Arrow */}
                    <Button variant="ghost" size="icon" onClick={goToNextPage} className="h-10 w-10 shrink-0 text-teal-400 hover:text-teal-300 hover:bg-teal-500/20">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Collapsible Content */}
                <CollapsibleContent 
                  className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                >
                  {/* Events List with Slider */}
                  <div 
                    className="relative overflow-hidden pt-3"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
                  >
                    <div 
                      className="flex"
                      style={{
                        transform: `translateX(calc(-${currentPage * 100}% + ${isDragging ? dragOffset : 0}px))`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                      }}
                    >
                      {Array.from({ length: totalPages }).map((_, pageIdx) => {
                        const pageEvents = events.slice(pageIdx * EVENTS_PER_PAGE, (pageIdx + 1) * EVENTS_PER_PAGE);
                        return (
                          <div key={pageIdx} className="w-full flex-shrink-0">
                            <div className="space-y-2">
                              {pageEvents.map(event => (
                                <div key={event.id} className="flex items-center justify-between p-4 bg-background/60 rounded-lg hover:bg-background/80 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group">
                                  {/* Left side: Event info */}
                                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                                    <div className={`w-2 h-2 rounded-full ${event.status === 'upcoming' ? 'bg-teal-400 animate-pulse' : 'bg-muted-foreground/50'} group-hover:bg-teal-300 transition-colors mt-1.5`} />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium group-hover:text-teal-100 transition-colors truncate">{event.title}</h4>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-muted-foreground group-hover:text-teal-200 transition-colors flex items-center gap-1">
                                          <Calendar className="w-3 h-3 hidden sm:block" />
                                          <span className="sm:hidden">{format(event.date, 'MMM dd')}</span>
                                          <span className="hidden sm:inline">{format(event.date, 'MMM dd, yyyy')}</span>
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
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Event Platforms Badge Grid */}
                  <div className="mt-6 pt-6 border-t border-teal-500/20">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">Event Data Sources</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {eventPlatforms.map((platform) => (
                        <Badge
                          key={platform.name}
                          variant="tag"
                          className="px-3 py-1.5 justify-center truncate cursor-pointer hover:scale-105 transition-transform"
                          style={{ 
                            backgroundColor: `${platform.color}20`,
                            borderColor: platform.color,
                            color: platform.color
                          }}
                        >
                          {platform.name}
                        </Badge>
                      ))}
                      {/* Always show 3 blank + slots */}
                      <Badge
                        variant="outline"
                        className="px-3 py-1.5 justify-center cursor-pointer hover:bg-teal-500/20 transition-colors"
                      >
                        +
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1.5 justify-center cursor-pointer hover:bg-teal-500/20 transition-colors"
                      >
                        +
                      </Badge>
                      <Badge
                        variant="outline"
                        className="px-3 py-1.5 justify-center cursor-pointer hover:bg-teal-500/20 transition-colors"
                      >
                        +
                      </Badge>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>

            </div>
          </div>

          {/* Full Width Collapse Toggle at Bottom */}
          <CollapsibleTrigger asChild>
            <button className="w-full py-3 flex items-center justify-center text-sm text-muted-foreground hover:text-teal-400 hover:bg-teal-500/10 transition-all border-t border-teal-500/20">
              {isOpen ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <span>Show Events</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>;
};
export default EventsCard;