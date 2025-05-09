
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface StatisticsChartProps {
  data: DataItem[];
  title: string;
  color?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  dataKey?: string;
  className?: string;
}

export const StatisticsChart: React.FC<StatisticsChartProps> = ({
  data,
  title,
  color = "var(--primary)",
  xAxisLabel,
  yAxisLabel,
  dataKey = "value",
  className,
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
                label={
                  xAxisLabel ? { 
                    value: xAxisLabel, 
                    position: 'insideBottom', 
                    offset: -10,
                    fontSize: 12,
                    fill: 'var(--muted-foreground)'
                  } : undefined
                }
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12 }}
                label={
                  yAxisLabel ? { 
                    value: yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft',
                    fontSize: 12,
                    fill: 'var(--muted-foreground)'
                  } : undefined
                }
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)' }}
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.375rem' 
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
