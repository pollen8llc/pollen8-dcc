import { useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";
import { mockContacts, getStrengthDistribution, getAverageScores } from "@/data/mockConnectionStrengthData";
import { getAllStrengthConfigs } from "@/config/connectionStrengthConfig";
import { getUserNetworkScore } from "@/services/connectionStrengthService";
import { useUser } from "@/contexts/UserContext";
import { 
  Users, TrendingUp, Zap, Target, Activity, BarChart3, 
  ArrowRight, MapPin, Network, X, ChevronLeft, ChevronRight
} from "lucide-react";

type ChartCategory = 'distribution' | 'relationships' | 'contacts' | 'strength' | 'orbits' | 'communities' | null;

export default function NetworkOverview() {
  const { currentUser } = useUser();
  
  // Fetch user's network score
  const { data: networkScoreData } = useQuery({
    queryKey: ['user-network-score', currentUser?.id],
    queryFn: () => getUserNetworkScore(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  // Get mock data statistics
  const strengthDistribution = useMemo(() => getStrengthDistribution(), []);
  const averageScores = useMemo(() => getAverageScores(), []);
  const strengthConfigs = useMemo(() => getAllStrengthConfigs(), []);

  // Calculate mock network metrics
  const totalContacts = mockContacts.length;
  const avgScore = Math.round(averageScores.total);
  const networkScore = networkScoreData?.score || avgScore * totalContacts;

  // Calculate engagement breakdown
  const engagementBreakdown = useMemo(() => {
    const total = mockContacts.length;
    const activeInPath = mockContacts.filter(c => c.pathFactors.isActiveInPath).length;
    const withStrategy = mockContacts.filter(c => c.pathFactors.hasStrategy).length;
    const recentActivity = mockContacts.filter(c => c.pathFactors.recentPathActivity).length;
    
    return {
      activeInPath: Math.round((activeInPath / total) * 100),
      withStrategy: Math.round((withStrategy / total) * 100),
      recentActivity: Math.round((recentActivity / total) * 100),
    };
  }, []);

  // Mock distribution data (unique locations)
  const distributionStats = useMemo(() => {
    // Mock: assume contacts spread across different locations
    const uniqueLocations = Math.ceil(totalContacts * 0.6); // ~60% unique locations
    return {
      locations: uniqueLocations,
      topRegion: 'West Coast'
    };
  }, [totalContacts]);

  // Mock density/interconnection data
  const densityStats = useMemo(() => {
    // Mock: contacts sharing same state/category/industry
    const sameState = Math.round(totalContacts * 0.35);
    const sameIndustry = Math.round(totalContacts * 0.45);
    const interconnected = Math.round((sameState + sameIndustry) / 2);
    return {
      interconnected,
      percentage: Math.round((interconnected / totalContacts) * 100)
    };
  }, [totalContacts]);

  const userName = currentUser?.name || 'User';

  // State for chart view
  const [selectedChart, setSelectedChart] = useState<ChartCategory>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [timelineOffset, setTimelineOffset] = useState(0);
  const [dateRange, setDateRange] = useState<'1W' | '1M' | '3M'>('3M');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle category click - smooth crossfade
  const handleCategoryClick = (category: ChartCategory) => {
    if (category === null) {
      // Closing chart - fade out then show network value
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedChart(null);
        setTimelineOffset(0);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
    } else if (selectedChart === category) {
      // Same category clicked - close it
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedChart(null);
        setTimelineOffset(0);
        setTimeout(() => setIsAnimating(false), 50);
      }, 200);
    } else if (selectedChart) {
      // Switching between charts - direct crossfade
      setTimelineOffset(0);
      setSelectedChart(category);
    } else {
      // Opening chart from network value
      setIsAnimating(true);
      setTimelineOffset(0);
      setSelectedChart(category);
      setTimeout(() => setIsAnimating(false), 50);
    }
  };

  // Navigate timeline
  const navigateTimeline = (direction: 'left' | 'right') => {
    const step = 1;
    if (direction === 'left' && timelineOffset > 0) {
      setTimelineOffset(prev => Math.max(0, prev - step));
    } else if (direction === 'right' && timelineOffset < 12) {
      setTimelineOffset(prev => Math.min(12, prev + step));
    }
  };

  // Generate data points based on date range
  const generateDataPoints = (baseValue: number, targetValue: number, count: number): number[] => {
    const points: number[] = [];
    const step = (targetValue - baseValue) / (count - 1);
    for (let i = 0; i < count; i++) {
      const value = baseValue + (step * i) + (Math.random() * 2 - 1); // Add slight variation
      points.push(Math.max(0, Math.round(value)));
    }
    return points;
  };

  // Extended chart data for scrolling timeline (18 months of data)
  const getChartData = (category: ChartCategory) => {
    const baseData: Record<string, { finalValue: number, color: string, label: string }> = {
      distribution: { finalValue: distributionStats.locations, color: '#cbd5e1', label: 'Locations' },
      relationships: { finalValue: densityStats.percentage, color: '#2dd4bf', label: 'Connections' },
      contacts: { finalValue: totalContacts, color: '#facc15', label: 'Contacts' },
      strength: { finalValue: avgScore, color: '#4ade80', label: 'Strength' },
      orbits: { finalValue: engagementBreakdown.activeInPath, color: '#a78bfa', label: 'Active' },
      communities: { finalValue: engagementBreakdown.recentActivity, color: '#60a5fa', label: 'Engaged' },
    };
    
    const categoryData = baseData[category || 'distribution'] || baseData.distribution;
    
    // Determine number of data points based on date range
    const pointCountMap: Record<string, number> = {
      '1W': 2,   // 2 points for 1 week
      '1M': 4,   // 4 points for 1 month
      '3M': 12,  // 4 points per month * 3 months
    };
    
    const pointCount = pointCountMap[dateRange] || 12;
    const startValue = Math.max(1, categoryData.finalValue * 0.7); // Start at 70% of final value
    const values = generateDataPoints(startValue, categoryData.finalValue, pointCount);
    
    // Generate labels based on date range
    const labels: string[] = [];
    const now = new Date();
    for (let i = pointCount - 1; i >= 0; i--) {
      const date = new Date(now);
      if (dateRange === '1W') {
        date.setDate(date.getDate() - (i * 3.5)); // Every ~3.5 days
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else if (dateRange === '1M') {
        date.setDate(date.getDate() - (i * 7)); // Every week
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      } else if (dateRange === '3M') {
        date.setDate(date.getDate() - (i * 7)); // Every week
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    labels.reverse(); // Reverse to show oldest to newest
    
    return { 
      months: labels,
      values: values,
      color: categoryData.color, 
      label: categoryData.label,
      canGoLeft: false,
      canGoRight: false
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 pb-32 space-y-6 animate-fade-in">
        {/* Network Value Header - Bentobox Layout */}
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {/* Main Panel - Network Value / Chart View (full width) */}
          <div className="col-span-12">
            <div className="rounded-2xl bg-slate-900 border border-teal-500/30">
              
              {/* Network Value Display */}
              {!selectedChart && (
                <div className="flex flex-col items-center justify-center p-6 min-h-[280px]">
                  {/* Label */}
                  <div className="text-xs text-teal-400/70 uppercase tracking-[0.2em] mb-3">
                    Network Value
                  </div>
                  
                  {/* Main Score Display */}
                  <div className="font-mono text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums">
                    {(() => {
                      const scoreStr = networkScore.toString();
                      const maxDigits = 7;
                      const paddedScore = scoreStr.padEnd(maxDigits, '0');
                      const actualDigits = paddedScore.slice(0, scoreStr.length);
                      const trailingZeros = paddedScore.slice(scoreStr.length);
                      
                      return (
                        <span className="drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                          <span className="text-teal-400">{actualDigits}</span>
                          <span className="text-teal-900/30">{trailingZeros}</span>
                        </span>
                      );
                    })()}
                  </div>
                  
                  {/* Hint */}
                  <div className="text-[10px] text-teal-400/40 mt-4 uppercase tracking-wider">
                    Click a stat below to view trends
                  </div>
                  
                  {/* Bottom info bar */}
                  <div className="w-full mt-6 pt-4 border-t border-teal-500/10">
                    <div className="flex items-center justify-between text-xs text-teal-400/60">
                      <div className="flex items-center gap-2">
                        <UnifiedAvatar userId={currentUser?.id} size={18} />
                        <span>{userName}</span>
                      </div>
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                </div>
              )}
              
              {/* Chart View */}
              {selectedChart && (
                <div className="p-4">
                  {/* Chart Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: getChartData(selectedChart).color }}>
                        {getChartData(selectedChart).label}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Timeline
                      </span>
                    </div>
                    <button 
                      onClick={() => handleCategoryClick(null)}
                      className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                      <X className="h-4 w-4 text-teal-400" />
                    </button>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {(['1W', '1M', '3M'] as const).map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setDateRange(range);
                          setTimelineOffset(0);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                          dateRange === range
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50 hover:text-slate-300'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  
                  {/* Canvas Timeline Area */}
                  <div className="relative h-[280px] flex items-center">
                      {/* Canvas */}
                      <div 
                        ref={canvasRef}
                        className="w-full h-full overflow-hidden relative"
                      >
                        {/* Grid Background */}
                        <div className="absolute inset-0">
                          {/* Horizontal grid lines */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div 
                              key={`h-${i}`} 
                              className="absolute w-full border-t border-slate-700/40" 
                              style={{ top: `${i * 25}%` }}
                            />
                          ))}
                          {/* Vertical grid lines - dynamic based on data points */}
                          {selectedChart && (() => {
                            const chartData = getChartData(selectedChart);
                            const pointCount = chartData.values.length;
                            return Array.from({ length: pointCount }).map((_, i) => (
                              <div 
                                key={`v-${i}`} 
                                className="absolute h-full border-l border-slate-700/40" 
                                style={{ left: `${(i / (pointCount - 1 || 1)) * 100}%` }}
                              />
                            ));
                          })()}
              </div>
              
                        {/* Timeline Content with transition */}
                        <div 
                          className="absolute inset-0 transition-transform duration-300 ease-out"
                          style={{ transform: `translateX(0)` }}
                        >
                          {/* SVG for edges and nodes */}
                          <svg className="absolute inset-0 w-full h-full" style={{ padding: '15px 0 35px 0' }}>
                            {selectedChart && (() => {
                              const chartData = getChartData(selectedChart);
                              const maxVal = Math.max(...chartData.values) * 1.2;
                              const padding = { top: 25, bottom: 50 };
                              const height = 280 - padding.top - padding.bottom;
                              
                              const points = chartData.values.map((val, i) => ({
                                x: 10 + (i / (chartData.values.length - 1)) * 80,
                                y: padding.top + height - (val / maxVal) * height,
                                value: val,
                                month: chartData.months[i]
                              }));
                              
                              return (
                                <>
                                  {/* Gradient definition */}
                                  <defs>
                                    <linearGradient id={`canvas-gradient-${selectedChart}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor={chartData.color} stopOpacity="0.15" />
                                      <stop offset="100%" stopColor={chartData.color} stopOpacity="0" />
                                    </linearGradient>
                                  </defs>
                                  
                                  {/* Area fill */}
                                  <path 
                                    d={`M ${points.map(p => `${p.x}% ${p.y}`).join(' L ')} L ${points[points.length-1].x}% ${padding.top + height} L ${points[0].x}% ${padding.top + height} Z`}
                                    fill={`url(#canvas-gradient-${selectedChart})`}
                                  />
                                  
                                  {/* Edge lines (connections between nodes) */}
                                  {points.map((point, i) => {
                                    if (i === points.length - 1) return null;
                                    const next = points[i + 1];
                                    return (
                                      <line
                                        key={`edge-${i}`}
                                        x1={`${point.x}%`}
                                        y1={point.y}
                                        x2={`${next.x}%`}
                                        y2={next.y}
                                        stroke={chartData.color}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="transition-all duration-300"
                                      />
                                    );
                                  })}
                                  
                                  {/* Nodes */}
                                  {points.map((point, i) => (
                                    <g key={`node-${i}`} className="transition-all duration-300">
                                      {/* Node glow */}
                                      <circle
                                        cx={`${point.x}%`}
                                        cy={point.y}
                                        r="12"
                                        fill={chartData.color}
                                        opacity="0.2"
                                      />
                                      {/* Node outer ring */}
                                      <circle
                                        cx={`${point.x}%`}
                                        cy={point.y}
                                        r="8"
                                        fill="rgb(15, 23, 42)"
                                        stroke={chartData.color}
                                        strokeWidth="2"
                                      />
                                      {/* Node inner dot */}
                                      <circle
                                        cx={`${point.x}%`}
                                        cy={point.y}
                                        r="3"
                                        fill={chartData.color}
                                      />
                                      {/* Value label */}
                                      <text
                                        x={`${point.x}%`}
                                        y={point.y - 16}
                                        textAnchor="middle"
                                        className="text-[10px] font-bold"
                                        fill={chartData.color}
                                      >
                                        {point.value}
                                      </text>
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                          
                          {/* Month labels */}
                          <div className="absolute bottom-2 left-[10%] right-[10%] flex justify-between px-0">
                            {selectedChart && getChartData(selectedChart).months.map((month, i) => (
                              <span 
                                key={`${month}-${i}`} 
                                className="text-[9px] text-slate-500 font-medium"
                              >
                                {month}
                              </span>
                            ))}
              </div>
            </div>
          </div>
        </div>

                    </div>
              )}
                  </div>
            </div>

          {/* Stats Grid - 6 boxes in 3 columns (2 rows) */}
          {/* Row 1 */}
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('distribution')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'distribution' ? 'border-slate-300 ring-2 ring-slate-300/30' : 'border-slate-400/30 hover:border-slate-300/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-slate-400/60 uppercase tracking-widest mb-1">Distribution</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-slate-300" />
                  <span className="text-2xl font-bold text-slate-200">{distributionStats.locations}</span>
              </div>
                <div className="text-xs text-slate-400/80 mt-1">Locations</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('relationships')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'relationships' ? 'border-teal-400 ring-2 ring-teal-400/30' : 'border-teal-500/30 hover:border-teal-400/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-teal-400/60 uppercase tracking-widest mb-1">Relationships</div>
                <div className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-teal-400" />
                  <span className="text-2xl font-bold text-teal-300">{densityStats.percentage}%</span>
                </div>
                <div className="text-xs text-teal-400/80 mt-1">Connections</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('contacts')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'contacts' ? 'border-yellow-400 ring-2 ring-yellow-400/30' : 'border-yellow-500/30 hover:border-yellow-400/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-yellow-400/60 uppercase tracking-widest mb-1">Contacts</div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-300">{totalContacts}</span>
                </div>
                <div className="text-xs text-yellow-400/80 mt-1">Total</div>
              </div>
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('strength')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'strength' ? 'border-green-400 ring-2 ring-green-400/30' : 'border-green-500/30 hover:border-green-400/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-green-400/60 uppercase tracking-widest mb-1">Avg Strength</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-300">{avgScore}%</span>
                </div>
                <div className="text-xs text-green-400/80 mt-1">Network</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('orbits')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'orbits' ? 'border-purple-400 ring-2 ring-purple-400/30' : 'border-purple-500/30 hover:border-purple-400/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-purple-400/60 uppercase tracking-widest mb-1">Orbits</div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-300">{engagementBreakdown.activeInPath}%</span>
                </div>
                <div className="text-xs text-purple-400/80 mt-1">Active</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-6 md:col-span-4">
            <div 
              onClick={() => handleCategoryClick('communities')}
              className={`relative h-full min-h-[96px] rounded-xl bg-slate-900/70 border overflow-hidden p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedChart === 'communities' ? 'border-blue-400 ring-2 ring-blue-400/30' : 'border-blue-500/30 hover:border-blue-400/50'}`}
            >
              <div className="flex flex-col justify-center h-full">
                <div className="text-[10px] text-blue-400/60 uppercase tracking-widest mb-1">Communities</div>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-300">{engagementBreakdown.recentActivity}%</span>
                </div>
                <div className="text-xs text-blue-400/80 mt-1">Engaged</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/rel8/actv8" className="group">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <Zap className="h-4 w-4 text-teal-400" />
              <span className="text-sm font-medium text-teal-300 hidden sm:inline">Actv8</span>
              <ArrowRight className="h-3 w-3 text-teal-400/50 group-hover:text-teal-400 transition-colors" />
                </div>
          </Link>
          <Link to="/rel8/insights" className="group">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300 hidden sm:inline">Insights</span>
              <ArrowRight className="h-3 w-3 text-purple-400/50 group-hover:text-purple-400 transition-colors" />
                </div>
          </Link>
          <Link to="/admin?tab=connection-strength" className="group">
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900/60 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300 hidden sm:inline">Settings</span>
              <ArrowRight className="h-3 w-3 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                </div>
          </Link>
        </div>

        {/* Connection Strength Distribution */}
        <div className="rounded-2xl bg-slate-900/80 border border-teal-500/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-teal-400" />
            <h3 className="text-lg font-semibold text-teal-300">Connection Strength Distribution</h3>
          </div>
          
          {/* Strength Bars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {strengthConfigs.map((config, index) => {
              const count = strengthDistribution[config.id as keyof typeof strengthDistribution] || 0;
              const percentage = Math.round((count / totalContacts) * 100);
              const colorStyles = [
                { border: 'border-sky-300/20', text: 'text-sky-200', textBold: 'text-white', gradient: 'linear-gradient(to right, #ffffff, #7dd3fc)', textMuted: 'text-sky-300/60' },
                { border: 'border-blue-400/20', text: 'text-blue-300', textBold: 'text-blue-200', gradient: 'linear-gradient(to right, #7dd3fc, #3b82f6)', textMuted: 'text-blue-400/60' },
                { border: 'border-indigo-500/20', text: 'text-indigo-400', textBold: 'text-indigo-300', gradient: 'linear-gradient(to right, #3b82f6, #6366f1)', textMuted: 'text-indigo-400/60' },
                { border: 'border-violet-500/20', text: 'text-violet-400', textBold: 'text-violet-300', gradient: 'linear-gradient(to right, #6366f1, #8b5cf6)', textMuted: 'text-violet-400/60' },
              ][index];
              
              return (
                <div key={config.id} className={`p-4 rounded-xl bg-slate-900/60 border ${colorStyles.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${colorStyles.text}`}>{config.label}</span>
                    <span className={`text-lg font-bold ${colorStyles.textBold}`}>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percentage}%`, background: colorStyles.gradient }}
                    />
                  </div>
                  <div className={`text-[10px] ${colorStyles.textMuted} mt-1`}>{percentage}% of network</div>
                </div>
              );
            })}
          </div>

          {/* Network Health */}
          <div className="mt-5 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-teal-300">Network Health</span>
              <span className="text-sm text-teal-400/60">{avgScore}% average</span>
            </div>
            <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
              <div 
                className="h-full"
                style={{ 
                  width: `${Math.min(25, (strengthDistribution.spark / totalContacts) * 100)}%`,
                  background: 'linear-gradient(to right, #ffffff, #7dd3fc)'
                }}
              />
              <div 
                className="h-full"
                style={{ 
                  width: `${Math.min(25, (strengthDistribution.ember / totalContacts) * 100)}%`,
                  background: 'linear-gradient(to right, #7dd3fc, #3b82f6)'
                }}
              />
              <div 
                className="h-full"
                style={{ 
                  width: `${Math.min(25, (strengthDistribution.flame / totalContacts) * 100)}%`,
                  background: 'linear-gradient(to right, #3b82f6, #6366f1)'
                }}
              />
              <div 
                className="h-full"
                style={{ 
                  width: `${Math.min(25, (strengthDistribution.star / totalContacts) * 100)}%`,
                  background: 'linear-gradient(to right, #6366f1, #8b5cf6)'
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-2">
              <span className="text-sky-300/60">Spark</span>
              <span className="text-blue-400/60">Ember</span>
              <span className="text-indigo-400/60">Flame</span>
              <span className="text-violet-400/60">Star</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
}
