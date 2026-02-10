import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Quote } from '@/constants/quotes';
import { useFavorites } from '@/contexts/FavoritesContext';
import Colors from '@/constants/colors';

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
        <Heart
          size={32}
          color={favorited ? Colors.gold : Colors.cream}
          fill={favorited ? Colors.gold : 'transparent'}
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
