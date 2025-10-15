import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleTest = ({ instrument }) => {
  console.log('SimpleTest rendering with instrument:', instrument);
  
  if (!instrument) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No instrument data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Test</Text>
      <Text style={styles.text}>Name: {instrument.name}</Text>
      <Text style={styles.text}>Category: {instrument.category}</Text>
      <Text style={styles.text}>Description: {instrument.description}</Text>
      <Text style={styles.text}>Features: {instrument.features?.join(', ')}</Text>
      <Text style={styles.text}>Usage: {instrument.usage}</Text>
      <Text style={styles.text}>Material: {instrument.material}</Text>
      <Text style={styles.text}>Size: {instrument.size}</Text>
      <Text style={styles.text}>Sterilization: {instrument.sterilization}</Text>
      <Text style={styles.text}>Manufacturer: {instrument.manufacturer}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 8,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
  },
});

export default SimpleTest;
