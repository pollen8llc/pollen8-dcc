
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { eachMonthOfInterval, format, subMonths } from "date-fns";

// Mock data - in a real app this would come from an API
const generateMockGrowthData = () => {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 5);
  
  // Get an array of the last 6 months
  const months = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: today
  });
  
  // Generate growth data with a positive trend
  return months.map((date, index) => {
    const baseValue = 5;
    const randomGrowth = Math.floor(Math.random() * 7) + 3; // Random number between 3-10
    return {
      month: format(date, 'MMM'),
      count: baseValue + (index * randomGrowth),
    };
  });
};

export const ContactGrowthChart = () => {
  const [data] = useState(generateMockGrowthData());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Growth</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis 
              dataKey="month"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                borderRadius: '0.375rem'
              }}
              formatter={(value) => [`${value} contacts`]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--primary)"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
