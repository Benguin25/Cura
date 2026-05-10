import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Image, Polygon, G } from 'react-native-svg';
import { IMG_W, IMG_H, BODY_PARTS, toPoints } from '../data/bodyMap';
import { COLORS } from '../types/onboarding';

interface BodyMapSummaryProps {
  selectedKeys: string[];
  width?: number;
}

export function BodyMapSummary({ selectedKeys, width = 300 }: BodyMapSummaryProps) {
  const scale = width / IMG_W;
  const height = IMG_H * scale;
  
  const selections = new Set(selectedKeys);
  const selectedLabels = BODY_PARTS
    .filter((p) => selections.has(p.key))
    .map((p) => p.label);

  if (selectedKeys.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No areas selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Image
          href={require('../../assets/bodymap/img/males-1859518_960_720.jpg')}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid meet"
        />
        <G>
          {BODY_PARTS.map((part) => {
            const selected = selections.has(part.key);
            if (!selected) return null;
            return (
              <Polygon
                key={part.key}
                points={toPoints(part.coords, scale)}
                fill={COLORS.primary}
                fillOpacity={0.45}
                stroke={COLORS.primary}
                strokeOpacity={1}
                strokeWidth={2 * scale}
              />
            );
          })}
        </G>
      </Svg>
      
      <View style={styles.chipsRow}>
        {selectedLabels.map((label) => (
          <View key={label} style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: COLORS.primary + '15', // 15% opacity
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
});
