import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { JiaziYear, EarthlyBranch } from '../types';
import { EARTHLY_BRANCHES, ELEMENT_COLORS } from '../constants';
import { JIAZI_CYCLE, getLiuQiColor } from '../utils/jiazi';

interface JiaziWheelProps {
  selectedYear: JiaziYear | null;
  onSelectYear: (year: JiaziYear) => void;
  width?: number;
  height?: number;
}

const JiaziWheel: React.FC<JiaziWheelProps> = ({ 
  selectedYear, 
  onSelectYear, 
  width = 600, 
  height = 600 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const radius = Math.min(width, height) / 2;
  const innerRadius = radius * 0.35;
  const middleRadius = radius * 0.65;
  const outerRadius = radius * 0.95;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // --- Layer 1: Earthly Branches (Inner Ring) ---
    // 12 segments
    const branchPie = d3.pie<EarthlyBranch>()
      .value(1)
      .sort((a, b) => a.index - b.index)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    const branchArc = d3.arc<d3.PieArcDatum<EarthlyBranch>>()
      .innerRadius(innerRadius)
      .outerRadius(middleRadius)
      .padAngle(0.01);

    const branchGroup = g.append("g").attr("class", "branches");
    
    const branchPaths = branchGroup.selectAll("path")
      .data(branchPie(EARTHLY_BRANCHES))
      .enter()
      .append("path")
      .attr("d", branchArc)
      .attr("fill", d => getLiuQiColor(d.data.liuQi.shortName))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .style("opacity", 0.9);

    // Labels for Branches & Liu Qi
    branchGroup.selectAll("text.branch-label")
      .data(branchPie(EARTHLY_BRANCHES))
      .enter()
      .append("text")
      .attr("transform", d => {
        const [x, y] = branchArc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-family", "'Noto Serif SC', serif")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#1e293b")
      .text(d => d.data.char);

    branchGroup.selectAll("text.qi-label")
      .data(branchPie(EARTHLY_BRANCHES))
      .enter()
      .append("text")
      .attr("transform", d => {
        const [x, y] = branchArc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .style("font-size", "10px")
      .style("fill", "#475569")
      .text(d => d.data.liuQi.shortName);


    // --- Layer 2: 60 Jiazi (Outer Ring) ---
    const jiaziPie = d3.pie<JiaziYear>()
      .value(1)
      .sort((a, b) => a.index - b.index)
      .startAngle(0)
      .endAngle(2 * Math.PI); 
      
    const jiaziArc = d3.arc<d3.PieArcDatum<JiaziYear>>()
      .innerRadius(middleRadius + 5)
      .outerRadius(outerRadius)
      .padAngle(0.02);

    const jiaziGroup = g.append("g").attr("class", "jiazi");

    jiaziGroup.selectAll("path")
      .data(jiaziPie(JIAZI_CYCLE))
      .enter()
      .append("path")
      .attr("d", jiaziArc)
      .attr("fill", d => ELEMENT_COLORS[d.data.stem.element])
      .attr("stroke", d => d.data.index === selectedYear?.index ? "#000" : "none")
      .attr("stroke-width", d => d.data.index === selectedYear?.index ? 2 : 0)
      .style("cursor", "pointer")
      .style("opacity", d => {
        if (!selectedYear) return 0.8;
        return d.data.index === selectedYear.index ? 1 : 0.4;
      })
      .on("click", (event, d) => onSelectYear(d.data))
      .on("mouseover", function() {
        d3.select(this).style("opacity", 1).attr("transform", "scale(1.02)");
      })
      .on("mouseout", function(event, d) {
         const isSelected = selectedYear && d.data.index === selectedYear.index;
         d3.select(this)
           .style("opacity", isSelected ? 1 : (selectedYear ? 0.4 : 0.8))
           .attr("transform", "scale(1)");
      });

    // Labels for Jiazi
    const textGroup = jiaziGroup.selectAll("text")
      .data(jiaziPie(JIAZI_CYCLE))
      .enter()
      .append("text")
      .attr("transform", d => {
        const [x, y] = jiaziArc.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90;
        return `translate(${x},${y}) rotate(${angle})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "9px")
      .style("font-family", "'Noto Serif SC', serif")
      .style("fill", "#fff")
      .style("pointer-events", "none") 
      .text(d => d.data.formattedName);

    // Center Text (Current Selection)
    if (selectedYear) {
      const centerGroup = g.append("g").attr("class", "center-info");
      
      centerGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "32px")
        .style("font-family", "'Noto Serif SC', serif")
        .style("font-weight", "bold")
        .style("fill", "#1e293b")
        .text(selectedYear.formattedName);

      centerGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .style("font-size", "14px")
        .style("fill", "#64748b")
        .text(selectedYear.branch.liuQi.name);
    } else {
       g.append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#94a3b8")
        .text("请选择年份");
    }

  }, [width, height, selectedYear, onSelectYear, innerRadius, middleRadius, outerRadius]);

  return (
    <div className="flex justify-center items-center overflow-hidden">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="max-w-full h-auto drop-shadow-xl"
      />
    </div>
  );
};

export default JiaziWheel;