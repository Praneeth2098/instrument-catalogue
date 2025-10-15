import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const InstrumentCard = ({ 
  instrument, 
  onSwipeLeft, 
  onSwipeRight, 
  onSetSelect,
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

            {/* Sets Badges */}
            {instrument.sets && instrument.sets.length > 0 && (
              <View style={styles.setsContainer}>
                {instrument.sets.map((set, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.setBadge}
                    onPress={() => onSetSelect && onSetSelect(set)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.setText}>{set}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Brief Description */}
            {instrument.brief && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Brief:</Text>
                <Text style={styles.sectionText}>{instrument.brief}</Text>
              </View>
            )}

            {/* Description */}
            {instrument.description && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Description:</Text>
                <Text style={styles.sectionText}>{instrument.description}</Text>
              </View>
            )}

            {/* Type */}
            {instrument.type && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Type:</Text>
                <Text style={styles.sectionText}>{instrument.type}</Text>
              </View>
            )}

            {/* Usage */}
            {instrument.usage && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Usage:</Text>
                <Text style={styles.sectionText}>{instrument.usage}</Text>
              </View>
            )}

            {/* Important Considerations */}
            {instrument.importantConsiderations && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Important Considerations:</Text>
                <Text style={styles.sectionText}>{instrument.importantConsiderations}</Text>
              </View>
            )}

            {/* Cleaning & Sterilization */}
            {instrument.cleaningSterilization && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Cleaning & Sterilization:</Text>
                <Text style={styles.sectionText}>{instrument.cleaningSterilization}</Text>
              </View>
            )}

            {/* Inspection & Maintenance */}
            {instrument.inspectionMaintenance && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Inspection & Maintenance:</Text>
                <Text style={styles.sectionText}>{instrument.inspectionMaintenance}</Text>
              </View>
            )}


        </View>
        </ScrollView>
        
        {/* Fixed Instructional Overlay */}
        <View style={styles.instructionOverlay}>
          <Text style={styles.instructionText}>
            ↑ Scroll to see more details ↑
          </Text>
          <Text style={styles.instructionText}>
            ← Swipe to navigate between instruments →
          </Text>
        </View>
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
    backgroundColor: 'rgba(0, 144, 214, 0.6)', // More transparent light blue
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  instrumentName: {
    color: '#FFFFFF',
    fontSize: 20, // Match banner title size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 80, // Extra padding to account for instruction overlay
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
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  setBadge: {
    backgroundColor: '#3498DB', // Blue color for sets
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  setText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5D6D7E',
    textAlign: 'justify',
  },
  instructionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(240, 248, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  instructionText: {
    fontSize: 12,
    color: '#5A6C7D',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 2,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    padding: 20,
  },
});

export default InstrumentCard;
