import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { ShopCard } from '../../components/ShopCard';
import { CoinDisplay } from '../../components/CoinDisplay';
import { useAppContext } from '../../contexts/AppContext';
import { PANDA_TYPES } from '../../constants/pandaTypes';

export default function ShopScreen() {
  const { coins, spendCoins, addPanda, countOfType } = useAppContext();

  const handleBuy = (pandaId: string, price: number, name: string) => {
    Alert.alert('Buy Pet', `Buy ${name} for ${price} coins?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Buy',
        onPress: async () => {
          const success = await spendCoins(price);
          if (success) {
            await addPanda(pandaId);
            Alert.alert('Welcome!', `${name} has joined your zoo!`);
          } else {
            Alert.alert('Not enough coins', 'Complete more quests to earn coins!');
          }
        },
      },
    ]);
  };

  const rows: (typeof PANDA_TYPES[number])[][] = [];
  for (let i = 0; i < PANDA_TYPES.length; i += 2) {
    rows.push(PANDA_TYPES.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Buy pets for your zoo</Text>
        <CoinDisplay coins={coins} />
      </View>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((item) => (
            <ShopCard
              key={item.id}
              panda={item}
              ownedCount={countOfType(item.id)}
              onBuy={() => handleBuy(item.id, item.price, item.name)}
            />
          ))}
          {row.length === 1 && <View style={styles.placeholder} />}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
    paddingBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 12,
  },
  row: {
    flexDirection: 'row',
  },
  placeholder: {
    flex: 1,
    margin: 6,
  },
});
