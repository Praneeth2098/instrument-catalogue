import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ScrollTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scroll Test</Text>
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test Card</Text>
          
          <Text style={styles.sectionTitle}>Section 1</Text>
          <Text style={styles.text}>This is the first section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 2</Text>
          <Text style={styles.text}>This is the second section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 3</Text>
          <Text style={styles.text}>This is the third section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 4</Text>
          <Text style={styles.text}>This is the fourth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 5</Text>
          <Text style={styles.text}>This is the fifth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 6</Text>
          <Text style={styles.text}>This is the sixth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 7</Text>
          <Text style={styles.text}>This is the seventh section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 8</Text>
          <Text style={styles.text}>This is the eighth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 9</Text>
          <Text style={styles.text}>This is the ninth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 10</Text>
          <Text style={styles.text}>This is the tenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 11</Text>
          <Text style={styles.text}>This is the eleventh section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 12</Text>
          <Text style={styles.text}>This is the twelfth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 13</Text>
          <Text style={styles.text}>This is the thirteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 14</Text>
          <Text style={styles.text}>This is the fourteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 15</Text>
          <Text style={styles.text}>This is the fifteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 16</Text>
          <Text style={styles.text}>This is the sixteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 17</Text>
          <Text style={styles.text}>This is the seventeenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 18</Text>
          <Text style={styles.text}>This is the eighteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 19</Text>
          <Text style={styles.text}>This is the nineteenth section of content.</Text>
          
          <Text style={styles.sectionTitle}>Section 20</Text>
          <Text style={styles.text}>This is the twentieth section of content.</Text>
          
          <Text style={styles.finalText}>🎉 If you can see this text, scrolling is working! 🎉</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginTop: 15,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#5D6D7E',
    marginBottom: 10,
  },
  finalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
  },
});

export default ScrollTest;
