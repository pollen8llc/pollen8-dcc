import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadarDataPoint {
  category: string;
  id: string;
  importance: number;
  color: string;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  width?: number;
  height?: number;
  angleOffset?: number;
  strokeColor?: string;
  fillColor?: string;
  activeVector?: number;
  stage1Complete?: Set<string>;
  stage2Complete?: Set<string>;
  pulsingNode?: number | null;
  onNodeClick?: (index: number) => void;
  onNodeDrag?: (index: number, importance: number) => void;
  onDragUpdate?: (importance: number) => void;
  onDragStart?: () => void;
}

export const RadarChart = ({ 
  data, 
  width = 500, 
  height = 500,
  angleOffset = 0,
  strokeColor = 'hsl(var(--primary))',
  fillColor = 'hsl(var(--primary))',
  activeVector,
  stage1Complete = new Set(),
  stage2Complete = new Set(),
  pulsingNode = null,
  onNodeClick,
  onNodeDrag,
  onDragUpdate,
  onDragStart
}: RadarChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Use refs to store callbacks to prevent unnecessary re-renders
  const onNodeClickRef = useRef(onNodeClick);
  const onNodeDragRef = useRef(onNodeDrag);
  const onDragUpdateRef = useRef(onDragUpdate);
  const onDragStartRef = useRef(onDragStart);
  
  // Update refs when callbacks change
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
    onNodeDragRef.current = onNodeDrag;
    onDragUpdateRef.current = onDragUpdate;
    onDragStartRef.current = onDragStart;
  });

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
    const levels = 10;
    for (let i = 1; i <= levels; i++) {
      const levelRadius = (radius / levels) * i;
      g.append('circle')
        .attr('r', levelRadius)
        .attr('fill', 'none')
        .attr('stroke', 'hsl(var(--primary) / 0.2)')
        .attr('stroke-width', 1);
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

      // Add labels with badge styling
      const labelRadius = radius * 1.2;
      const labelX = Math.cos(angle) * labelRadius;
      const labelY = Math.sin(angle) * labelRadius;

      const labelGroup = g.append('g')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .style('cursor', 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          onNodeClickRef.current?.(i);
        });

      // Add badge background
      const textElement = labelGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'hsl(var(--foreground))')
        .attr('font-size', '14px')
        .attr('font-weight', '600')
        .text(d.category);

      const bbox = (textElement.node() as SVGTextElement).getBBox();
      
      labelGroup.insert('rect', 'text')
        .attr('x', bbox.x - 8)
        .attr('y', bbox.y - 4)
        .attr('width', bbox.width + 16)
        .attr('height', bbox.height + 8)
        .attr('rx', 12)
        .attr('fill', 'hsl(var(--background) / 0.9)')
        .attr('stroke', 'hsl(var(--primary) / 0.3)')
        .attr('stroke-width', 1);
    });

    // Draw data area
    const radarLine = d3.lineRadial<RadarDataPoint>()
      .angle((d, i) => angleSlice * i + offsetRadians)
      .radius(d => rScale(d.importance))
      .curve(d3.curveLinearClosed);

    const radarPath = g.append('path')
      .datum(data)
      .attr('class', 'radar-path')
      .attr('d', radarLine)
      .attr('fill', fillColor)
      .attr('fill-opacity', 0.25)
      .attr('stroke', strokeColor)
      .attr('stroke-width', 2);

    // Helper function to update radar path in real-time
    const updateRadarPath = (currentData: RadarDataPoint[]) => {
      radarPath
        .datum(currentData)
        .attr('d', radarLine);
    };

    // Draw data points with drag & click
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2 + offsetRadians;
      const r = rScale(d.importance);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;

      const isPulsing = pulsingNode === i;
      const isStage1Complete = stage1Complete.has(d.id);
      const isStage2Complete = stage2Complete.has(d.id);

      // Determine node visual state
      let nodeRadius = 8;
      let nodeFill = d.color;
      let nodeStroke = 'hsl(var(--background))';
      let nodeStrokeWidth = 2;
      let nodeOpacity = 0.3;
      let nodeCursor = 'pointer';
      
      if (isStage2Complete) {
        // Stage 2: Fully complete - Blue with checkmark
        nodeRadius = 12;
        nodeFill = '#3b82f6';
        nodeStroke = 'white';
        nodeStrokeWidth = 3;
        nodeOpacity = 1;
        nodeCursor = 'pointer';
      } else if (isPulsing) {
        // Stage 1 complete: Pulsing, ready to drag
        nodeRadius = 10;
        nodeFill = d.color;
        nodeStroke = 'white';
        nodeStrokeWidth = 3;
        nodeOpacity = 1;
        nodeCursor = 'grab';
      } else {
        // Default: Unconfigured
        nodeRadius = 8;
        nodeOpacity = isStage1Complete ? 0.6 : 0.3;
      }

      const circle = g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', nodeRadius)
        .attr('fill', nodeFill)
        .attr('stroke', nodeStroke)
        .attr('stroke-width', nodeStrokeWidth)
        .attr('opacity', nodeOpacity)
        .style('cursor', nodeCursor)
        .style('transition', 'all 0.3s ease-out')
        .style('filter', isStage2Complete ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' : 
                         isPulsing ? `drop-shadow(0 0 12px ${d.color})` : 'none');

      // Add pulse animation to pulsing node
      if (isPulsing) {
        circle.append('animate')
          .attr('attributeName', 'r')
          .attr('values', '10;14;10')
          .attr('dur', '1.5s')
          .attr('repeatCount', 'indefinite');
      }

      // Draw checkmark for Stage 2 complete nodes
      if (isStage2Complete) {
        g.append('path')
          .attr('d', 'M -4,-1 L -1,3 L 4,-3')
          .attr('transform', `translate(${x}, ${y})`)
          .attr('stroke', 'white')
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('stroke-linecap', 'round')
          .attr('stroke-linejoin', 'round')
          .style('pointer-events', 'none');
      }

      // Click handler
      circle.on('click', (event) => {
        event.stopPropagation();
        onNodeClickRef.current?.(i);
      });

      // Drag behavior - only if Stage 1 is complete
      if (onNodeDrag && isStage1Complete) {
        const drag = d3.drag()
          .on('start', function() {
            d3.select(this).style('cursor', 'grabbing');
            onDragStartRef.current?.();
          })
          .on('drag', function(event) {
            const dx = event.x;
            const dy = event.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const importance = Math.min(100, Math.max(0, (distance / radius) * 100));
            
            // Snap to 25% increments
            const snapped = Math.round(importance / 25) * 25;
            
            // Update visual position
            const newR = rScale(snapped);
            const newX = Math.cos(angle) * newR;
            const newY = Math.sin(angle) * newR;
            
            d3.select(this)
              .attr('cx', newX)
              .attr('cy', newY);

            // Real-time edge updates
            const updatedData = data.map((item, idx) => 
              idx === i ? { ...item, importance: snapped } : item
            );
            updateRadarPath(updatedData);
            
            // Notify parent of drag update
            onDragUpdateRef.current?.(snapped);
          })
          .on('end', function(event) {
            d3.select(this).style('cursor', isStage2Complete ? 'pointer' : 'grab');
            const dx = event.x;
            const dy = event.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const importance = Math.min(100, Math.max(0, (distance / radius) * 100));
            const snapped = Math.round(importance / 25) * 25;
            onNodeDragRef.current?.(i, snapped);
          });

        circle.call(drag as any);
      }

      circle.append('title')
        .text(`${d.category}: ${d.importance}%`);
    });

  }, [data, width, height, angleOffset, strokeColor, fillColor, stage1Complete, stage2Complete, pulsingNode]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};
