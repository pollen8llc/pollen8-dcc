
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
  color = "#00eada",
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
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
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
                cursor={{ fill: 'rgba(0, 234, 218, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(215 25% 10%)',
                  borderColor: 'hsl(215 25% 18%)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
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
