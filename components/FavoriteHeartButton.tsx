import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Quote } from '@/constants/quotes';
import { useFavorites } from '@/contexts/FavoritesContext';
import Colors from '@/constants/colors';

interface FavoriteHeartButtonProps {
  quote: Quote;
}

export function FavoriteHeartButton({ quote }: FavoriteHeartButtonProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const favorited = isFavorited(quote.id);

  return (
    <Pressable
      onPress={() => toggleFavorite(quote)}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={styles.button}
    >
      <View pointerEvents="none">
        <Heart
          size={28}
          color={favorited ? '#e74c3c' : Colors.gold}
          fill={favorited ? '#e74c3c' : 'transparent'}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
  },
});
