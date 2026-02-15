import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { ShopCard } from '../../components/ShopCard';
import { CoinDisplay } from '../../components/CoinDisplay';
import { useCoins } from '../../hooks/useCoins';
import { usePandas } from '../../hooks/usePandas';
import { PANDA_TYPES } from '../../constants/pandaTypes';

export default function ShopScreen() {
  const { coins, spendCoins } = useCoins();
  const { addPanda, hasPanda } = usePandas();

  const handleBuy = async (pandaId: string, price: number, name: string) => {
    if (hasPanda(pandaId)) return;

    Alert.alert('Buy Panda', `Buy ${name} for ${price} coins?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Buy',
        onPress: async () => {
          const success = await spendCoins(price);
          if (success) {
            addPanda(pandaId);
            Alert.alert('Welcome!', `${name} has joined your grassland!`);
          } else {
            Alert.alert('Not enough coins', 'Complete more quests to earn coins!');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Collect unique pandas for your grassland</Text>
        <CoinDisplay coins={coins} />
      </View>
      <FlatList
        data={PANDA_TYPES}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ShopCard
            panda={item}
            owned={hasPanda(item.id)}
            onBuy={() => handleBuy(item.id, item.price, item.name)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grassBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray600,
    flex: 1,
    marginRight: 12,
  },
  grid: {
    padding: 10,
    paddingBottom: 40,
  },
});
