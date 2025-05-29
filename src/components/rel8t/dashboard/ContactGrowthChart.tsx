
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Sample data - in a real app, this would come from an API
const data = [
  { name: 'Jan', contacts: 4 },
  { name: 'Feb', contacts: 7 },
  { name: 'Mar', contacts: 10 },
  { name: 'Apr', contacts: 15 },
  { name: 'May', contacts: 20 },
  { name: 'Jun', contacts: 25 },
  { name: 'Jul', contacts: 30 },
];

export const ContactGrowthChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
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
