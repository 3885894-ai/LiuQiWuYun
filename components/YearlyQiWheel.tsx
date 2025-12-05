import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { YearlyQiStep } from '../types';
import { getLiuQiColor } from '../utils/jiazi';

interface YearlyQiWheelProps {
  steps: YearlyQiStep[];
  width?: number;
  height?: number;
}

const YearlyQiWheel: React.FC<YearlyQiWheelProps> = ({ 
  steps, 
  width = 400, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Dimensions
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.45;  // Main Qi (Inner)
  const middleRadius = radius * 0.65; // Boundary
  const outerRadius = radius * 0.85;  // Guest Qi (Outer)
  const labelRadius = radius * 0.95;  // Labels

  useEffect(() => {
    if (!svgRef.current || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Mapping steps to angles.
    // We want Step 3 (Si Tian) at the TOP (12 o'clock).
    // Clockwise direction.
    // Step 3 is index 2 in 0-based array.
    // 6 steps = 60 degrees (PI/3) each.
    // If Step 3 is centered at -90deg (Top/12oclock),
    // Step 3 Range: -120 to -60 degrees? No, center is -90. So -120 to -60.
    // Let's configure the arc generator start/end logic based on step index.
    
    // Logic:
    // Step 3 (Index 2): Top. Angle 0 (if we rotate group).
    // Let's define specific start/end angles for each index to match the position.
    // Position Map (Clockwise, Top=0):
    // Index 2 (Step 3): 330° to 30° (-30 to 30) -> Top
    // Index 3 (Step 4): 30° to 90° -> Top Right
    // Index 4 (Step 5): 90° to 150° -> Bottom Right
    // Index 5 (Step 6): 150° to 210° -> Bottom (Zai Quan)
    // Index 0 (Step 1): 210° to 270° -> Bottom Left
    // Index 1 (Step 2): 270° to 330° -> Top Left

    // D3 Arc uses radians, 0 is at 12 o'clock if we subtract PI/2? 
    // Default D3 0 is 3 o'clock.
    // Let's use a function to get angles based on step index.
    
    const getAngles = (stepIndex: number) => {
        // Shift logic so Step 3 (index 2) is at Top.
        // Step 3 should correspond to -PI/2 (Top in standard cartesian)? 
        // Or simply:
        // Index 2 -> Start: -PI/6, End: PI/6 (Centered at 0, which is Right?? No wait)
        
        // Let's use standard D3 0 = 12 o'clock logic by rotating the whole group -90deg? 
        // Or just calc radians directly.
        // 0 rad = 3 o'clock.
        // Top = -PI/2.
        
        // Step 3 (Index 2) Center = -PI/2. 
        // Step 4 (Index 3) Center = -PI/6.
        // Step 5 (Index 4) Center = PI/6.
        // Step 6 (Index 5) Center = PI/2 (Bottom).
        // Step 1 (Index 0) Center = 5*PI/6.
        // Step 2 (Index 1) Center = -5*PI/6 (or 7*PI/6).
        
        // Arc width = PI/3.
        const centerAngles = {
            2: -Math.PI / 2,        // Step 3: Top
            3: -Math.PI / 6,        // Step 4: Top Right
            4: Math.PI / 6,         // Step 5: Bottom Right
            5: Math.PI / 2,         // Step 6: Bottom
            0: 5 * Math.PI / 6,     // Step 1: Bottom Left
            1: -5 * Math.PI / 6,    // Step 2: Top Left (technically 4.71 rads)
        };

        const center = (centerAngles as any)[stepIndex];
        return {
            startAngle: center - Math.PI / 6,
            endAngle: center + Math.PI / 6,
            centroidAngle: center
        };
    };

    // --- Arcs ---
    const innerArc = d3.arc<YearlyQiStep>()
      .innerRadius(innerRadius)
      .outerRadius(middleRadius)
      .startAngle(d => getAngles(d.index - 1).startAngle)
      .endAngle(d => getAngles(d.index - 1).endAngle)
      .padAngle(0.02);

    const outerArc = d3.arc<YearlyQiStep>()
      .innerRadius(middleRadius)
      .outerRadius(outerRadius)
      .startAngle(d => getAngles(d.index - 1).startAngle)
      .endAngle(d => getAngles(d.index - 1).endAngle)
      .padAngle(0.02);

    // --- Groups ---
    const wheelGroup = g.append("g");

    // 1. Inner Ring (Main Qi)
    wheelGroup.selectAll(".main-qi-arc")
        .data(steps)
        .enter()
        .append("path")
        .attr("d", innerArc)
        .attr("fill", d => getLiuQiColor(d.mainQi.shortName))
        .attr("opacity", 0.8)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    // 2. Outer Ring (Guest Qi)
    wheelGroup.selectAll(".guest-qi-arc")
        .data(steps)
        .enter()
        .append("path")
        .attr("d", outerArc)
        .attr("fill", d => getLiuQiColor(d.guestQi.shortName))
        .attr("stroke", d => d.isSiTian || d.isZaiQuan ? "#fff" : "white")
        .attr("stroke-width", d => d.isSiTian || d.isZaiQuan ? 2 : 1);

    // 3. Text Labels
    // Helper for text positioning
    const getTextPos = (angle: number, r: number) => {
        // angle is in radians, 0 is 3 o'clock.
        // x = r * cos(angle)
        // y = r * sin(angle)
        return [r * Math.cos(angle), r * Math.sin(angle)];
    };

    const textGroup = g.append("g").attr("class", "labels");

    steps.forEach(step => {
        const angles = getAngles(step.index - 1);
        const angle = angles.centroidAngle;
        
        // Step Name Label (Outside)
        const [lx, ly] = getTextPos(angle, labelRadius);
        textGroup.append("text")
            .attr("x", lx)
            .attr("y", ly)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("font-family", "'Noto Serif SC', serif")
            .style("font-weight", "bold")
            .style("fill", "#475569")
            .text(step.name); // e.g., 初之气

        // Guest Qi Name (Outer Ring)
        const [gx, gy] = getTextPos(angle, (middleRadius + outerRadius) / 2);
        textGroup.append("text")
            .attr("x", gx)
            .attr("y", gy)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "10px")
            .style("fill", "#fff")
            .style("font-weight", "bold")
            .style("text-shadow", "0px 0px 2px rgba(0,0,0,0.3)")
            .text(step.guestQi.shortName); // e.g. 少阳

        // Main Qi Name (Inner Ring)
        const [mx, my] = getTextPos(angle, (innerRadius + middleRadius) / 2);
        textGroup.append("text")
            .attr("x", mx)
            .attr("y", my)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("font-size", "10px")
            .style("fill", "#fff")
            .style("opacity", 0.9)
            .style("text-shadow", "0px 0px 2px rgba(0,0,0,0.3)")
            .text(step.mainQi.shortName); // e.g. 厥阴
        
        // Markers for Si Tian / Zai Quan
        if (step.isSiTian) {
            const [sx, sy] = getTextPos(angle, outerRadius + 25);
            textGroup.append("text")
                .attr("x", sx)
                .attr("y", sy)
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .style("font-size", "12px")
                .style("fill", "#4338ca") // Indigo 700
                .style("font-weight", "bold")
                .text("★ 司天");
        }
        if (step.isZaiQuan) {
            const [zx, zy] = getTextPos(angle, outerRadius + 25);
            textGroup.append("text")
                .attr("x", zx)
                .attr("y", zy)
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .style("font-size", "12px")
                .style("fill", "#059669") // Emerald 600
                .style("font-weight", "bold")
                .text("● 在泉");
        }
    });

    // Center Text
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "10px")
        .style("fill", "#94a3b8")
        .text("外环: 客气");
    
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "10px")
        .style("fill", "#94a3b8")
        .text("内环: 主气");

  }, [steps, width, height, innerRadius, middleRadius, outerRadius, labelRadius]);

  return (
    <div className="flex justify-center items-center">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="max-w-full h-auto drop-shadow-sm"
      />
    </div>
  );
};

export default YearlyQiWheel;