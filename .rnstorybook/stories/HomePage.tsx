
import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, Text, View, Animated } from 'react-native';
import { Card } from '../../components/Card';


const { width: screenWidth } = Dimensions.get('window');
const cardWidth = 240;
const gap = 20;
const snapToInterval = cardWidth + gap;
const sidePadding = (screenWidth - cardWidth) / 2;


export const HomePage = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const cards = [
    { key: '8ball', title: '8 Ball', description: 'Shoot all your group balls then pocket the 8 ball', cta: 'Play Now', image: require('../../assets/balls/8.png') },
    { key: '9ball', title: '9 Ball', description: 'Shoot balls in order from 1 to 9', cta: 'Play Now', image: require('../../assets/balls/9.png') },
    { key: 'profile', title: 'Profile', description: 'View your profile', cta: 'View Profile', iconName: 'account-circle' },
    { key: 'practice', title: 'Practice', description: 'Play solo to improve your skills', cta: 'Start Practice', iconName: 'trending-up' }
  ];

  return (
    <View className='w-full h-[90%] flex justify-center items-center py-2'>
      <Text className="text-6xl font-sans font-bold text-text-900 dark:text-text-100">Scorekeeper</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapToInterval}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ gap, paddingHorizontal: sidePadding }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={{ paddingTop: 75 }}
      >
        {cards.map((card, i) => {
          const inputRange = [
            (i - 1) * snapToInterval,
            i * snapToInterval,
            (i + 1) * snapToInterval
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.1, 1],
            extrapolate: 'clamp'
          });
          const key = card.key;
          delete card.key;
          return (
            <Animated.View key={key} style={{ transform: [{ scale }], width: cardWidth }}>
              <Card {...card} onPress={() => console.log(card.title + ' Card Pressed')} />
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};
