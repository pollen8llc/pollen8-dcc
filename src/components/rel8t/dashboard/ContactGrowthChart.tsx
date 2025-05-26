
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ContactGrowthChart = () => {
  const { data: chartData, isLoading } = useQuery({
    queryKey: ['contact-growth'],
    queryFn: async () => {
      // Get contacts with their creation dates
      const { data: contacts, error } = await supabase
        .from('rms_contacts')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching contact growth data:', error);
        return [];
      }

      if (!contacts || contacts.length === 0) {
        // Return sample data if no contacts exist
        return [
          { name: 'Jan', contacts: 0 },
          { name: 'Feb', contacts: 0 },
          { name: 'Mar', contacts: 0 },
          { name: 'Apr', contacts: 0 },
          { name: 'May', contacts: 0 },
          { name: 'Jun', contacts: 0 },
        ];
      }

      // Group contacts by month
      const monthCounts = contacts.reduce((acc, contact) => {
        const date = new Date(contact.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Convert to chart format with cumulative counts
      const chartData = [];
      let cumulativeCount = 0;
      
      for (const [month, count] of Object.entries(monthCounts)) {
        cumulativeCount += count;
        chartData.push({
          name: month,
          contacts: cumulativeCount
        });
      }

      return chartData;
    }
  });

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading contact growth data...</div>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))' 
            }} 
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="contacts" 
            name="Total Contacts" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { ContactGrowthChart };
