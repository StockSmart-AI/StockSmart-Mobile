declare module 'react-native-snap-carousel' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle, StyleProp } from 'react-native';

  export interface CarouselProperties<T> {
    data: T[];
    renderItem: (item: { item: T; index: number }) => React.ReactNode;
    sliderWidth: number;
    itemWidth: number;
    layout?: 'default' | 'stack' | 'tinder';
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    enableMomentum?: boolean;
    lockScrollWhileSnapping?: boolean;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    activeSlideAlignment?: 'center' | 'end' | 'start';
    inactiveSlideScale?: number;
    inactiveSlideOpacity?: number;
    onSnapToItem?: (index: number) => void;
  }

  export default class Carousel<T> extends Component<CarouselProperties<T>> {
    snapToItem(index: number, animated?: boolean): void;
    snapToNext(animated?: boolean): void;
    snapToPrev(animated?: boolean): void;
    startAutoplay(): void;
    stopAutoplay(): void;
  }
} 