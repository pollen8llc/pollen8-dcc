import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentType } from '@/models/knowledgeTypes';
import { startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, format, parseISO } from 'date-fns';

interface TimeSeriesDataPoint {
  name: string;
  count: number;
  date: Date;
}

export const useKnowledgeTimeSeriesData = (
  userId: string | undefined,
  contentType: ContentType,
  period: 'week' | 'month' | 'year'
) => {
  const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      if (!userId) {
        setData([]);
        setLoading(false);
        return;
      }

      try {
        // Calculate date range based on period
        const now = new Date();
        let startDate: Date;
        let intervals: Date[];

        if (period === 'week') {
          startDate = startOfWeek(now);
          intervals = eachDayOfInterval({ start: startDate, end: now });
        } else if (period === 'month') {
          startDate = startOfMonth(now);
          intervals = eachDayOfInterval({ start: startDate, end: now });
        } else {
          startDate = startOfYear(now);
          intervals = eachMonthOfInterval({ start: startDate, end: now });
        }

        // Fetch articles from database
        const { data: articles, error } = await supabase
          .from('knowledge_articles')
          .select('created_at, content_type')
          .eq('author_id', userId)
          .eq('content_type', contentType)
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching time series data:', error);
          setData([]);
          return;
        }

        // Group articles by interval
        const grouped = intervals.map((intervalDate) => {
          let count = 0;
          let label = '';

          if (period === 'week') {
            label = format(intervalDate, 'EEE'); // Mon, Tue, etc.
            count = (articles || []).filter(article => {
              const articleDate = parseISO(article.created_at);
              return format(articleDate, 'yyyy-MM-dd') === format(intervalDate, 'yyyy-MM-dd');
            }).length;
          } else if (period === 'month') {
            label = format(intervalDate, 'd'); // 1, 2, 3, etc.
            count = (articles || []).filter(article => {
              const articleDate = parseISO(article.created_at);
              return format(articleDate, 'yyyy-MM-dd') === format(intervalDate, 'yyyy-MM-dd');
            }).length;
          } else {
            label = format(intervalDate, 'MMM'); // Jan, Feb, etc.
            count = (articles || []).filter(article => {
              const articleDate = parseISO(article.created_at);
              return format(articleDate, 'yyyy-MM') === format(intervalDate, 'yyyy-MM');
            }).length;
          }

          return {
            name: label,
            count,
            date: intervalDate
          };
        });

        setData(grouped);
      } catch (error) {
        console.error('Error processing time series data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSeriesData();
  }, [userId, contentType, period]);

  return { data, loading };
};
