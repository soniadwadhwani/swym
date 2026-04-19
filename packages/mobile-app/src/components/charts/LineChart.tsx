import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme';

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showGradient?: boolean;
  showDots?: boolean;
  showLabels?: boolean;
}

export function LineChart({
  data,
  width = 320,
  height = 180,
  color = colors.accent,
  showGradient = true,
  showDots = true,
  showLabels = true,
}: LineChartProps) {
  const padding = { top: 20, right: 16, bottom: 30, left: 16 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values) * 0.95;
  const maxVal = Math.max(...values) * 1.05;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((d.value - minVal) / range) * chartH,
  }));

  // Smooth curve path using cubic bezier
  const buildPath = () => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx = (curr.x + next.x) / 2;
      path += ` C ${cpx} ${curr.y}, ${cpx} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const buildAreaPath = () => {
    const line = buildPath();
    const lastPt = points[points.length - 1];
    const firstPt = points[0];
    const bottom = padding.top + chartH;
    return `${line} L ${lastPt.x} ${bottom} L ${firstPt.x} ${bottom} Z`;
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgLinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.2} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + chartH * (1 - t);
          return (
            <Line
              key={`grid-${t}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(20,12,50,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {/* Gradient fill */}
        {showGradient && (
          <Path d={buildAreaPath()} fill="url(#lineGrad)" />
        )}

        {/* Line */}
        <Path d={buildPath()} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />

        {/* Dots */}
        {showDots &&
          points.map((p, i) => (
            <Circle key={`dot-${i}`} cx={p.x} cy={p.y} r={3.5} fill={color} />
          ))}

        {/* X-axis labels */}
        {showLabels &&
          data.map((d, i) => (
            <SvgText
              key={`label-${i}`}
              x={points[i].x}
              y={height - 6}
              textAnchor="middle"
              fill="rgba(20,12,50,0.4)"
              fontSize={10}
              fontWeight="500"
            >
              {d.label}
            </SvgText>
          ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
