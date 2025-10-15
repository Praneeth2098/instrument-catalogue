import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const InstrumentCard = ({ 
  instrument, 
  onSwipeLeft, 
  onSwipeRight, 
  screenWidth, 
  screenHeight 
}) => {
  const cardWidth = screenWidth - 40; // Account for padding
  const imageHeight = 200; // Fixed image height
  
  // Gesture handling for swiping
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Only respond to horizontal swipes, ignore vertical scrolling
      const horizontalMovement = Math.abs(translationX);
      const verticalMovement = Math.abs(translationY);
      
      // If vertical movement is greater than horizontal, it's a scroll - ignore
      if (verticalMovement > horizontalMovement) {
        // Reset position and return
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
          Animated.spring(rotate, { toValue: 0, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        ]).start();
        return;
      }
      
      // Determine swipe direction based on translation and velocity
      const swipeThreshold = cardWidth * 0.25;
      const velocityThreshold = 500;
      
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        // Swipe right - go to previous
        onSwipeRight();
      } else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        // Swipe left - go to next
        onSwipeLeft();
      }
      
      // Reset card position
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(rotate, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    }
  };

  // Update rotation and scale based on translation
  const rotateInterpolate = translateX.interpolate({
    inputRange: [-cardWidth, 0, cardWidth],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  const scaleInterpolate = translateX.interpolate({
    inputRange: [-cardWidth, 0, cardWidth],
    outputRange: [0.95, 1, 0.95],
    extrapolate: 'clamp',
  });
  
  // Fallback if no instrument data
  if (!instrument) {
    return (
      <View style={[styles.card, { width: cardWidth }]}>
        <Text style={styles.errorText}>No instrument data available</Text>
      </View>
    );
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-5, 5]}
    >
      <Animated.View
        style={[
          styles.card, 
          { 
            width: cardWidth,
            transform: [
              { translateX },
              { translateY },
              { rotate: rotateInterpolate },
              { scale: scaleInterpolate },
            ],
          }
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
        {/* Image Section */}
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image
            source={{ uri: instrument.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.instrumentName}>{instrument.name}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
            {/* Category Badge */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{instrument.category}</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>{instrument.description}</Text>

            {/* Key Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Key Features:</Text>
              {instrument.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>
                  • {feature}
                </Text>
              ))}
            </View>

            {/* Usage Information */}
            <View style={styles.usageContainer}>
              <Text style={styles.usageTitle}>Common Uses:</Text>
              <Text style={styles.usageText}>{instrument.usage}</Text>
            </View>

            {/* Additional Information */}
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalTitle}>Technical Specifications:</Text>
              <Text style={styles.additionalText}>• Material: {instrument.material}</Text>
              <Text style={styles.additionalText}>• Size: {instrument.size}</Text>
              <Text style={styles.additionalText}>• Sterilization: {instrument.sterilization}</Text>
              <Text style={styles.additionalText}>• Manufacturer: {instrument.manufacturer}</Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navigationContainer}>
              <TouchableOpacity style={styles.navButton} onPress={onSwipeRight}>
                <Text style={styles.navButtonText}>← Previous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.navButton} onPress={onSwipeLeft}>
                <Text style={styles.navButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Scroll Hint */}
            <View style={styles.scrollHint}>
              <Text style={styles.hintText}>
                ↑ Scroll to see more details ↑
              </Text>
              <Text style={styles.hintText}>
                ← Swipe to navigate between instruments →
              </Text>
            </View>
        </View>
        </ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  instrumentName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 40,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E86AB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'justify',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5D6D7E',
    marginBottom: 4,
  },
  usageContainer: {
    marginBottom: 20,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  usageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5D6D7E',
  },
  additionalInfo: {
    marginBottom: 20,
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  additionalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5D6D7E',
    marginBottom: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollHint: {
    alignItems: 'center',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 12,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    padding: 20,
  },
});

export default InstrumentCard;
