import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Quote } from '@/constants/quotes';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteHeartButtonProps {
  quote: Quote;
  onPress?: () => void;
}

export function FavoriteHeartButton({ quote, onPress }: FavoriteHeartButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(quote.id);

  const handlePress = async () => {
    await toggleFavorite(quote);
    onPress?.();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.button}
      >
        <AntDesign
          name={favorited ? 'heart' : 'hearto'}
          size={32}
          color={favorited ? '#d4af37' : '#f5f1e8'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 12,
  },
});
