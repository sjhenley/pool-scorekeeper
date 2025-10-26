import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, Animated } from 'react-native';
import { Card, CardProps } from '@/components';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = 225;
const gap = 40;
const snapToInterval = cardWidth + gap;
const sidePadding = (screenWidth - cardWidth) / 2;

function sanitizeInitialIndex(initialIndex: number | undefined, dataLength: number): number {
  // Accept 0 as a valid index. Only treat undefined/null or out-of-range values as invalid.
  if (initialIndex === undefined || initialIndex === null || initialIndex < 0 || initialIndex >= dataLength) {
    return 0;
  }
  return initialIndex;
}

export interface CarouselProps {
  /** Cards to Display */
  data: CardProps[];
  /** Index of carousel item to be focused on initial render */
  initialIndex?: number;
}

/** Primary UI component for user interaction */
export const Carousel = ({
  data,
  initialIndex
}: CarouselProps) => {
  // Compute a sanitized initial index once (or whenever initialIndex/data.length changes)
  const initialIdx = sanitizeInitialIndex(initialIndex, data.length);
  const scrollX = useRef(new Animated.Value(initialIdx * snapToInterval)).current;
  // Use a flexible ref type for the Animated.ScrollView instance to avoid
  // referencing the runtime value as a TypeScript type.
  const scrollViewRef = useRef<any>(null);
  const [focusedIndex, setFocusedIndex] = useState(initialIdx);

  // Ensure the scroll view is positioned at the desired initial index when the
  // component mounts or when initialIdx changes. Use a non-animated scroll so
  // the starting focusedIndex remains correct even if onScroll doesn't fire.
  useEffect(() => {
    // scrollTo may not be immediately available; schedule on next tick if needed.
    const handle = setTimeout(() => {
      const ref: any = scrollViewRef.current;
      if (ref && typeof ref.scrollTo === 'function') {
        ref.scrollTo({ x: initialIdx * snapToInterval, animated: false });
      }
    }, 0);
    return () => clearTimeout(handle);
  }, [initialIdx]);
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
