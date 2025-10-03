import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Globe3DProps {
  cities?: string[];
  width?: number;
  height?: number;
}

export const Globe3D = ({ cities = [], width = 200, height = 200 }: Globe3DProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const projection = d3.geoOrthographic()
      .scale(width / 2.5)
      .translate([width / 2, height / 2])
      .rotate([0, -20]);

    const path = d3.geoPath().projection(projection);

    // Create gradient for globe
    const defs = svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'globe-gradient')
      .attr('cx', '35%')
      .attr('cy', '35%');
    
    gradient.append('stop')
      .attr('offset', '5%')
      .attr('stop-color', 'hsl(var(--primary))')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'hsl(var(--primary))')
      .attr('stop-opacity', 0.2);

    const g = svg.append('g');

    // Draw globe sphere
    g.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', width / 2.5)
      .attr('fill', 'url(#globe-gradient)')
      .attr('stroke', 'hsl(var(--primary))')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Draw graticule (grid lines)
    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--primary) / 0.3)')
      .attr('stroke-width', 0.5);

    // Add rotating animation
    let angle = 0;
    const rotate = () => {
      angle += 0.5;
      projection.rotate([angle, -20]);
      g.selectAll('path').attr('d', path as any);
    };

    const interval = setInterval(rotate, 50);

    // Add city markers (simplified as dots)
    const numMarkers = Math.min(cities.length || 5, 8);
    for (let i = 0; i < numMarkers; i++) {
      const theta = (i / numMarkers) * 2 * Math.PI;
      const phi = Math.PI / 4;
      const x = width / 2 + (width / 2.5) * Math.sin(phi) * Math.cos(theta) * 0.7;
      const y = height / 2 - (width / 2.5) * Math.cos(phi) * 0.7;

      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 3)
        .attr('fill', 'hsl(var(--primary))')
        .attr('stroke', 'hsl(var(--background))')
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0 0 4px hsl(var(--primary)))');
    }

    return () => clearInterval(interval);
  }, [cities, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
