import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme';

interface BarDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showNegative?: boolean;
}

export function BarChart({
  data,
  width = 320,
  height = 160,
  color = colors.accent,
  showNegative = false,
}: BarChartProps) {
  const padding = { top: 16, right: 16, bottom: 30, left: 16 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const values = data.map((d) => d.value);
  const maxAbs = Math.max(...values.map(Math.abs), 0.1);

  const barWidth = (chartW / data.length) * 0.6;
  const barGap = (chartW / data.length) * 0.4;

  const baseline = showNegative ? padding.top + chartH / 2 : padding.top + chartH;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={padding.left}
          y1={baseline}
          x2={width - padding.right}
          y2={baseline}
          stroke="rgba(20,12,50,0.1)"
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const x = padding.left + i * (chartW / data.length) + barGap / 2;
          const maxBarH = showNegative ? chartH / 2 : chartH;
          const barH = (Math.abs(d.value) / maxAbs) * maxBarH;
          const isNeg = d.value < 0;
          const y = isNeg ? baseline : baseline - barH;

          const barColor =
            Math.abs(d.value) > 1.5
              ? colors.error
              : Math.abs(d.value) > 0.8
              ? colors.warning
              : colors.success;

          return (
            <React.Fragment key={`bar-${i}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={4}
                fill={showNegative ? barColor : color}
                opacity={0.85}
              />
              <SvgText
                x={x + barWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fill="rgba(20,12,50,0.4)"
                fontSize={10}
                fontWeight="500"
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
