import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, Animated } from 'react-native';
import { Card, CardProps } from '@/components/Card';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = 225;
const gap = 40;
const snapToInterval = cardWidth + gap;
const sidePadding = (screenWidth - cardWidth) / 2;

export interface CarouselProps {
  /** Cards to Display */
  data: CardProps[];
}

/** Primary UI component for user interaction */
export const Carousel = ({
  data
}: CarouselProps) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const idx = Math.round(value / snapToInterval);
      setFocusedIndex(idx);
    });
    return () => scrollX.removeListener(listenerId);
  }, [scrollX]);

  const handleCardPress = (i: number, card: CardProps) => {
    if (i !== focusedIndex && scrollViewRef.current) {
      // Scroll to the selected card
      scrollViewRef.current.scrollTo({
        x: i * snapToInterval,
        animated: true
      });
    } else if (!card.disabled && card.onPress) {
      // If already focused, trigger the card's onPress
      card.onPress();
    }
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={snapToInterval}
      snapToAlignment="start"
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: sidePadding,
        alignItems: 'center',
        height: 500
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      {data.map((card, i) => {
        const inputRange = [
          (i - 1) * snapToInterval,
          i * snapToInterval,
          (i + 1) * snapToInterval
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.95, 1.15, 0.95],
          extrapolate: 'clamp'
        });
        const cardProps = { ...card };
        return (
          <Animated.View
            key={`carousel-card-${i}`}
            style={{
              transform: [{ scale }],
              width: cardWidth,
              marginRight: i === data.length - 1 ? 0 : gap,
              alignItems: 'center'
            }}
          >
            <Card
              {...cardProps}
              disabled={card.disabled && i === focusedIndex}
              onPress={() => handleCardPress(i, card)}
            />
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
};
