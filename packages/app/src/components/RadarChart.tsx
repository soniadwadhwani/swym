import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing, Layout, Shadows } from '../theme';

interface Props {
  data: Record<string, number>; // label -> value 0-1
  size?: number;
}

export const RadarChart: React.FC<Props> = ({ data, size = 240 }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;

  const getPoint = (index: number, radius: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Data polygon points
  const dataPoints = values.map((v, i) => getPoint(i, maxR * v));
  const dataPolygonStr = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Grid polygon points for each ring
  const gridPolygons = rings.map(r => {
    const points = Array.from({ length: n }, (_, i) => getPoint(i, maxR * r));
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Grid */}
        {gridPolygons.map((points, i) => (
          <Polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke={Colors.border}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, maxR);
          return (
            <Line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke={Colors.border}
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <Polygon
          points={dataPolygonStr}
          fill={Colors.accent + '25'}
          stroke={Colors.accent}
          strokeWidth={2}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <Circle
            key={`point-${i}`}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={Colors.accent}
            stroke={Colors.white}
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {labels.map((label, i) => {
          const p = getPoint(i, maxR + 22);
          return (
            <SvgText
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize={11}
              fontWeight="500"
              fill={Colors.textMuted}
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>

      {/* Values below */}
      <View style={styles.values}>
        {labels.map((label, i) => (
          <View key={label} style={styles.valueItem}>
            <Text style={styles.valueNum}>{Math.round(values[i] * 100)}</Text>
            <Text style={styles.valueLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: Layout.cardRadius,
    padding: Spacing['2xl'],
    ...Shadows.card,
  },
  values: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  valueItem: {
    alignItems: 'center',
    minWidth: 56,
  },
  valueNum: {
    fontSize: 18,
    fontWeight: '300',
    color: Colors.accent,
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 2,
  },
});
