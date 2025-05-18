
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Users, Calendar, BarChart3, MessageSquare, Database, Settings } from "lucide-react";

// Feature data
const features = [
  {
    icon: Users,
    title: "Smart Contact Management",
    description: "Organize contacts with tags, notes, and reminders that help you remember key details and maintain authentic connections.",
    points: [
      "Intelligent tagging system", 
      "Intuitive contact organization", 
      "Custom fields and attributes"
    ]
  },
  {
    icon: Calendar,
    title: "Automated Follow-ups",
    description: "Never miss an important touchpoint with smart reminders and scheduling tools that keep your relationships active and engaged.",
    points: [
      "Customizable reminder schedules", 
      "Follow-up templates", 
      "Interaction history tracking"
    ]
  },
  {
    icon: BarChart3,
    title: "Relationship Analytics",
    description: "Gain valuable insights from your network data to understand patterns, identify key connectors, and improve engagement strategies.",
    points: [
      "Network visualization", 
      "Engagement metrics", 
      "Custom reporting tools"
    ]
  }
];

export const Features: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="bg-[#00eada]/10 text-[#00eada] text-xs tracking-wider font-semibold px-3 py-1.5 rounded-full">
          KEY FEATURES
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">Everything You Need To Manage Relationships</h2>
        <p className="text-muted-foreground">
          Our platform provides powerful tools for every aspect of relationship management, 
          helping you nurture connections that truly matter.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-border/20 bg-card/60 backdrop-blur-sm hover:border-[#00eada]/20 hover:shadow-lg transition-all duration-300 feature-card">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-[#00eada]/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[#00eada]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-[#00eada] flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
