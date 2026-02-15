import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Colors } from '../constants/colors';
import { WeightEntry } from '../hooks/useWeight';

interface WeightChartProps {
  entries: WeightEntry[];
}

export function WeightChart({ entries }: WeightChartProps) {
  if (entries.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Log at least 2 weights to see your chart</Text>
      </View>
    );
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const recent = sorted.slice(-14);
  const labels = recent.map((e) => {
    const d = new Date(e.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  const data = recent.map((e) => e.weight);
  const screenWidth = Dimensions.get('window').width - 40;

  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: labels.length > 7 ? labels.filter((_, i) => i % 2 === 0) : labels,
          datasets: [{ data }],
        }}
        width={screenWidth}
        height={200}
        yAxisSuffix=" lb"
        chartConfig={{
          backgroundColor: Colors.bgCard,
          backgroundGradientFrom: Colors.bgCard,
          backgroundGradientTo: Colors.bgCardLight,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(5, 108, 130, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(62, 106, 116, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: Colors.emerald,
          },
          propsForBackgroundLines: {
            stroke: Colors.emeraldBorder,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  empty: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgCardLight,
    borderRadius: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
});
