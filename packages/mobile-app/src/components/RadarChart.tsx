import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { RadarDataPoint } from '../types';

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
}

export function RadarChart({ data, size = 280 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.32;
  const labelRadius = size * 0.45;
  const sides = data.length;
  const angleStep = (2 * Math.PI) / sides;

  const getPoint = (index: number, scale: number) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: cx + radius * scale * Math.cos(angle),
      y: cy + radius * scale * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    return {
      x: cx + labelRadius * Math.cos(angle),
      y: cy + labelRadius * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Grid levels */}
        {gridLevels.map((level) => {
          const pts = data.map((_, i) => getPoint(i, level));
          const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
          return (
            <Polygon
              key={`grid-${level}`}
              points={poly}
              fill="none"
              stroke="rgba(20,12,50,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {data.map((_, i) => {
          const pt = getPoint(i, 1);
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke="rgba(20,12,50,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data fill */}
        <Polygon
          points={dataPolygon}
          fill="rgba(112,124,255,0.12)"
          stroke={colors.accent}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <Circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={colors.accent}
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const lp = getLabelPoint(i);
          return (
            <SvgText
              key={`label-${i}`}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              alignmentBaseline="central"
              fill="rgba(20,12,50,0.55)"
              fontSize={11}
              fontWeight="600"
            >
              {d.label}
            </SvgText>
          );
        })}

        {/* Value percentages */}
        {dataPoints.map((p, i) => (
          <SvgText
            key={`val-${i}`}
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            fill={colors.accent}
            fontSize={10}
            fontWeight="700"
          >
            {Math.round(data[i].value * 100)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
