import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadarDataPoint {
  category: string;
  importance: number;
  color: string;
}

interface CompactRadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

export const CompactRadarChart = ({ 
  data, 
  width = 140, 
  height = 140,
  strokeColor = 'hsl(var(--primary))',
  fillColor = 'hsl(var(--primary))'
}: CompactRadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    const angleSlice = (Math.PI * 2) / data.length;

    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw circular grid (minimal)
    const levels = 3;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--primary) / 0.15)')
        .attr('stroke-width', 1);
    }

    // Draw axes (thin)
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'hsl(var(--primary) / 0.2)')
        .attr('stroke-width', 0.5);
    });

    // Draw data area
    const radarLine = d3.lineRadial<RadarDataPoint>()
      .angle((d, i) => angleSlice * i)
      .radius(d => rScale(d.importance))
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', fillColor)
      .attr('fill-opacity', 0.3)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 0 4px hsl(var(--primary) / 0.3))');

    // Draw data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = rScale(d.importance);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 3)
        .attr('fill', strokeColor)
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 2);
    });

  }, [data, width, height, strokeColor, fillColor]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
