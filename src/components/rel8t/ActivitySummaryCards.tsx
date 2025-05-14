
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, AlertCircle, Users } from "lucide-react";

interface ActivitySummaryCardsProps {
  counts: {
    today: number;
    upcoming: number;
    overdue: number;
    contacts: number;
  };
  isLoading?: boolean;
}

export const ActivitySummaryCards: React.FC<ActivitySummaryCardsProps> = ({
  counts,
  isLoading = false
}) => {
  const items = [
    {
      title: "Today",
      value: counts.today,
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-blue-500"
    },
    {
      title: "Upcoming",
      value: counts.upcoming,
      icon: <Clock className="h-4 w-4" />,
      color: "bg-amber-500"
    },
    {
      title: "Overdue",
      value: counts.overdue,
      icon: <AlertCircle className="h-4 w-4" />,
      color: "bg-red-500"
    },
    {
      title: "Contacts",
      value: counts.contacts,
      icon: <Users className="h-4 w-4" />,
      color: "bg-green-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {items.map((item) => (
          <Card key={item.title} className="border shadow-sm h-24">
            <CardContent className="p-4 flex flex-col justify-center items-center h-full">
              <div className="animate-pulse flex flex-col items-center space-y-2">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="h-4 w-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <Card key={item.title} className="border shadow-sm">
          <CardContent className="p-4 flex flex-col items-center">
            <div className={`${item.color} text-white p-2 rounded-full mb-2`}>
              {item.icon}
            </div>
            <span className="text-2xl font-bold">{item.value}</span>
            <span className="text-xs text-muted-foreground">{item.title}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
