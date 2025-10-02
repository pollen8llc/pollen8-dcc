import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadarDataPoint {
  category: string;
  importance: number;
  color: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
}

export const RadarChart = ({ data, width = 500, height = 500 }: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    // Set viewBox for responsive scaling
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const radius = Math.min(width, height) / 2 - Math.max(...Object.values(margin));
    const centerX = width / 2;
    const centerY = height / 2;

    const angleSlice = (Math.PI * 2) / data.length;

    // Create scales
    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    const g = svg.append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Draw circular grid
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--primary) / 0.2)')
        .attr('stroke-width', 1);

      if (i === levels) {
        g.append('text')
          .attr('x', 5)
          .attr('y', -levelRadius)
          .attr('fill', 'hsl(var(--muted-foreground))')
          .attr('font-size', '10px')
          .text('100%');
      }
    }

    // Draw axes
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'hsl(var(--primary) / 0.3)')
        .attr('stroke-width', 1);

      // Add labels
      const labelRadius = radius * 1.15;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      g.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'hsl(var(--foreground) / 0.8)')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .text(d.category);
    });

    // Draw data area
    const radarLine = d3.lineRadial<RadarDataPoint>()
      .angle((d, i) => angleSlice * i)
      .radius(d => rScale(d.importance))
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', 'hsl(var(--primary))')
      .attr('fill-opacity', 0.25)
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2);

    // Draw data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const r = rScale(d.importance);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4)
        .attr('fill', d.color)
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .append('title')
        .text(`${d.category}: ${d.importance}%`);
    });

  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
