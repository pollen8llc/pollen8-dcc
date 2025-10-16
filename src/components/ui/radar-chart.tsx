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
  angleOffset?: number; // Rotation offset in degrees
  strokeColor?: string;
  fillColor?: string;
  activeVector?: number; // Index of currently active vector
  completedVectors?: Set<number>; // Set of completed vector indices
}

export const RadarChart = ({ 
  data, 
  width = 500, 
  height = 500,
  angleOffset = 0,
  strokeColor = 'hsl(var(--primary))',
  fillColor = 'hsl(var(--primary))',
  activeVector,
  completedVectors = new Set()
}: RadarChartProps) => {
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
    const offsetRadians = (angleOffset * Math.PI) / 180;

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
      const angle = angleSlice * i - Math.PI / 2 + offsetRadians;
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
      .angle((d, i) => angleSlice * i + offsetRadians)
      .radius(d => rScale(d.importance))
      .curve(d3.curveLinearClosed);

    g.append('path')
      .datum(data)
      .attr('d', radarLine)
      .attr('fill', fillColor)
      .attr('fill-opacity', 0.25)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2)
      .style('transition', 'd 0.3s ease-out');

    // Draw data points
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2 + offsetRadians;
      const r = rScale(d.importance);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      const isActive = activeVector === i;
      const isCompleted = completedVectors.has(i);
      const opacity = isCompleted || activeVector === undefined ? 1 : 0.3;

      const circle = g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', isActive ? 6 : 4)
        .attr('fill', d.color)
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 2)
        .attr('opacity', opacity)
        .style('cursor', 'pointer')
        .style('transition', 'all 0.3s ease-out');

      // Add pulse animation to active vector
      if (isActive) {
        circle.append('animate')
          .attr('attributeName', 'r')
          .attr('values', '6;8;6')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      circle.append('title')
        .text(`${d.category}: ${d.importance}%`);
    });

  }, [data, width, height, angleOffset, strokeColor, fillColor, activeVector, completedVectors]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
