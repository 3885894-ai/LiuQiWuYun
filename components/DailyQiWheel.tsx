import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DailyQiStep } from '../utils/dailyQi';
import { getLiuQiColor } from '../utils/jiazi';
import { SOVEREIGN_HEXAGRAMS, BAGUA_MAPPING } from '../constants';

interface DailyQiWheelProps {
  steps: DailyQiStep[];
  width?: number;
  height?: number;
}

const DailyQiWheel: React.FC<DailyQiWheelProps> = ({ 
  steps, 
  width = 400, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const radius = Math.min(width, height) / 2;
  
  // Revised Radii for multiple layers
  const centerRadius = radius * 0.25;
  const innerRadius = radius * 0.25;  // Start of Branches
  const branchRadius = radius * 0.45; // End of Branches / Start of Hexagrams
  const hexRadius = radius * 0.60;    // End of Hexagrams / Start of Bagua
  const baguaRadius = radius * 0.75;  // End of Bagua
  const outerRadius = radius * 0.85;  // Border
  const labelRadius = radius * 0.92;  // Time Labels

  useEffect(() => {
    if (!svgRef.current || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // --- Configuration ---
    // We want Wu (Noon, Index 6) at TOP (12 o'clock).
    // Rotation Logic: 
    // Index 6 (Wu) -> 0 rad (Top/12oclock)
    // Index 9 (You) -> PI/2 (Right/3oclock)
    // Index 0 (Zi) -> PI (Bottom/6oclock)
    // Index 3 (Mao) -> -PI/2 (Left/9oclock)
    
    const getAngles = (index: number) => {
        // center = (index - 6) * 30deg
        const center = (index - 6) * (Math.PI / 6);
        return {
            startAngle: center - Math.PI / 12, // -15 deg
            endAngle: center + Math.PI / 12,   // +15 deg
            centerAngle: center
        };
    };

    // --- Background / Structure ---
    g.append("circle")
     .attr("r", outerRadius)
     .attr("fill", "#fff")
     .attr("stroke", "#e2e8f0")
     .attr("stroke-width", 1);
     
    // Subtle Taiji Hint in background (optional, just a gradient)
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "taijiGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#fef2f2").attr("stop-opacity", 0.5); // Top (Yang/Fire)
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#f0f9ff").attr("stop-opacity", 0.5); // Bottom (Yin/Water)
    
    g.append("circle")
     .attr("r", centerRadius)
     .attr("fill", "url(#taijiGradient)");


    // --- Layer 1: 12 Earthly Branches (Inner Ring) ---
    const branchArc = d3.arc<DailyQiStep>()
      .innerRadius(innerRadius)
      .outerRadius(branchRadius)
      .startAngle(d => getAngles(d.branch.index).startAngle)
      .endAngle(d => getAngles(d.branch.index).endAngle)
      .padAngle(0.01);

    const branchGroup = g.append("g").attr("class", "branches");
    
    branchGroup.selectAll("path")
        .data(steps)
        .enter()
        .append("path")
        .attr("d", branchArc)
        .attr("fill", d => getLiuQiColor(d.branch.liuQi.shortName))
        .attr("opacity", d => d.isCurrent ? 1 : 0.6)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    // Branch Text
    branchGroup.selectAll("text")
        .data(steps)
        .enter()
        .append("text")
        .attr("transform", d => {
            const angle = getAngles(d.branch.index).centerAngle;
            const r = (innerRadius + branchRadius) / 2;
            const x = r * Math.sin(angle);
            const y = -r * Math.cos(angle);
            return `translate(${x},${y})`;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-family", "'Noto Serif SC', serif")
        .style("font-weight", "bold")
        .style("fill", "#fff")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .text(d => d.branch.char);


    // --- Layer 2: 12 Sovereign Hexagrams (Middle Ring) ---
    const hexArc = d3.arc<any>()
      .innerRadius(branchRadius)
      .outerRadius(hexRadius)
      .startAngle(d => getAngles(d.branchIndex).startAngle)
      .endAngle(d => getAngles(d.branchIndex).endAngle)
      .padAngle(0.01);
      
    const hexGroup = g.append("g").attr("class", "hexagrams");
    
    // Background for Hexagrams
    hexGroup.selectAll("path")
        .data(SOVEREIGN_HEXAGRAMS)
        .enter()
        .append("path")
        .attr("d", hexArc)
        .attr("fill", "#f8fafc")
        .attr("stroke", "#e2e8f0");
        
    // Hexagram Symbols
    hexGroup.selectAll("text.symbol")
        .data(SOVEREIGN_HEXAGRAMS)
        .enter()
        .append("text")
        .attr("transform", d => {
            const angle = getAngles(d.branchIndex).centerAngle;
            const r = (branchRadius + hexRadius) / 2;
            const x = r * Math.sin(angle);
            const y = -r * Math.cos(angle);
            // Rotate text to match angle for better aesthetics? Or keep upright?
            // Hexagrams are usually upright.
            return `translate(${x},${y})`;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "22px")
        .style("fill", "#334155")
        .text(d => d.char); // Unicode Hexagram


    // --- Layer 3: Bagua (Outer Ring) ---
    // Bagua maps to multiple branches.
    const baguaArc = d3.arc<any>()
      .innerRadius(hexRadius)
      .outerRadius(baguaRadius)
      .startAngle(d => {
         // Start angle of the first branch in the group
         const firstBranchIndex = d.branches[0];
         return getAngles(firstBranchIndex).startAngle;
      })
      .endAngle(d => {
         // End angle of the last branch in the group
         const lastBranchIndex = d.branches[d.branches.length - 1];
         return getAngles(lastBranchIndex).endAngle;
      })
      .padAngle(0.02);

    const baguaGroup = g.append("g").attr("class", "bagua");
    
    baguaGroup.selectAll("path")
        .data(BAGUA_MAPPING)
        .enter()
        .append("path")
        .attr("d", baguaArc)
        .attr("fill", "#fff") // or light tint d.color
        .attr("stroke", d => d.color)
        .attr("stroke-width", 1.5);
        
    // Bagua Text/Symbol
    baguaGroup.selectAll("text")
        .data(BAGUA_MAPPING)
        .enter()
        .append("text")
        .attr("transform", d => {
            // Find center of the group of branches
            const startIdx = d.branches[0];
            const endIdx = d.branches[d.branches.length - 1];
            
            // Handle edge case for crossing 0? Indices are sorted 0-11 in my logic?
            // Actually my getAngles handles 0..11.
            // But Qian wraps 10, 11. No wrap issues in my sorted order 0-11 if contiguous.
            // Oh, wait. indices: [10, 11].
            
            const startAngle = getAngles(startIdx).startAngle;
            const endAngle = getAngles(endIdx).endAngle;
            const midAngle = (startAngle + endAngle) / 2;
            
            const r = (hexRadius + baguaRadius) / 2;
            const x = r * Math.sin(midAngle);
            const y = -r * Math.cos(midAngle);
            
            // Rotate to align with arc?
            const rotateDeg = midAngle * (180 / Math.PI);
            return `translate(${x},${y}) rotate(${rotateDeg})`;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "14px")
        .style("font-family", "'Noto Serif SC', serif")
        .style("fill", d => d.color)
        .style("font-weight", "bold")
        .text(d => `${d.symbol}`);


    // --- Layer 4: Time Labels (Outside) ---
    const labelGroup = g.append("g").attr("class", "labels");
    
    labelGroup.selectAll("text")
        .data(steps)
        .enter()
        .append("text")
        .attr("transform", d => {
            const angle = getAngles(d.branch.index).centerAngle;
            const x = labelRadius * Math.sin(angle);
            const y = -labelRadius * Math.cos(angle);
            return `translate(${x},${y})`;
        })
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "9px")
        .style("fill", d => d.isCurrent ? "#1e293b" : "#94a3b8")
        .style("font-weight", d => d.isCurrent ? "bold" : "normal")
        .text(d => d.startTime);


    // --- Center Info ---
    const currentStep = steps.find(s => s.isCurrent);
    if (currentStep) {
        g.append("text")
         .attr("text-anchor", "middle")
         .attr("dy", "-0.8em")
         .style("font-size", "18px")
         .style("font-family", "'Noto Serif SC', serif")
         .style("font-weight", "bold")
         .style("fill", "#1e293b")
         .text(currentStep.label); // e.g., 卯时

        g.append("text")
         .attr("text-anchor", "middle")
         .attr("dy", "1.2em")
         .style("font-size", "12px")
         .style("fill", getLiuQiColor(currentStep.branch.liuQi.shortName))
         .style("font-weight", "bold")
         .text(currentStep.branch.liuQi.name);
         
        // Find Bagua/Hex info
        const hex = SOVEREIGN_HEXAGRAMS.find(h => h.branchIndex === currentStep.branch.index);
        if (hex) {
             g.append("text")
             .attr("text-anchor", "middle")
             .attr("dy", "3.5em")
             .style("font-size", "16px")
             .style("fill", "#64748b")
             .text(`${hex.name} ${hex.char}`);
        }
    }

    // --- Current Time Needle ---
    const now = new Date();
    // Formula: (Hour - 12) / 12 * PI -> radians from Top.
    // Need to account for minutes.
    const hoursFromNoon = (now.getHours() + now.getMinutes()/60) - 12;
    const needleAngleRad = (hoursFromNoon / 12) * Math.PI;
    const needleAngleDeg = needleAngleRad * (180 / Math.PI);

    g.append("line")
     .attr("x1", 0)
     .attr("y1", 0)
     .attr("x2", 0)
     .attr("y2", -labelRadius + 5) // Points up initially
     .attr("transform", `rotate(${needleAngleDeg})`)
     .attr("stroke", "#ef4444")
     .attr("stroke-width", 2)
     .attr("stroke-linecap", "round");
     
    g.append("circle")
     .attr("r", 3)
     .attr("fill", "#ef4444");

  }, [steps, width, height, centerRadius, innerRadius, branchRadius, hexRadius, baguaRadius, outerRadius, labelRadius]);

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

export default DailyQiWheel;