import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Colors, dashboardColors } from '../constants/colors';
import Fonts from '../constants/fonts';
import { moderateScale } from 'react-native-size-matters';
import SearchBar from './SearchBar';
import UnifiedSearchResults from './UnifiedSearchResults';
import { useColorContext } from '../contexts/ColorContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SpecializationSets = ({ specialization, onSetSelect, onSetSelectFromSearch, onBackToSpecializations, onInstrumentSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentSpecializationColor } = useColorContext();
  
  const handleSetPress = (setData) => {
    onSetSelect(setData);
  };

  // Show all sets (search will navigate to search page)
  const filteredSets = specialization?.sets || [];

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Safety check - don't render if no specialization data
  if (!specialization) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No specialization data available</Text>
      </View>
    );
  }

  const getSetColor = (setName) => {
    // Use the current specialization color from context
    return currentSpecializationColor;
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search everything..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />
      {searchQuery.trim() !== '' ? (
        <UnifiedSearchResults
          searchQuery={searchQuery}
          onSpecializationSelect={() => {}} // Not needed in sets view
          onSetSelect={onSetSelect}
          onSetSelectFromSearch={onSetSelectFromSearch}
          onInstrumentSelect={onInstrumentSelect}
          onBackToSearch={() => {}}
        />
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
        <View style={styles.setsGrid}>
          {filteredSets.sort((a, b) => a.name.localeCompare(b.name)).map((setData, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.setCard,
                { backgroundColor: getSetColor(setData.name) }
              ]}
              onPress={() => handleSetPress(setData)}
              activeOpacity={0.8}
            >
              <View style={styles.setCardContent}>
                <Text style={styles.setName}>
                  {setData.name}
                </Text>
                <Text style={styles.setCount}>
                  {setData.count} instruments
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  setsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  setCard: {
    width: (screenWidth - 45) / 2, // 2 columns with padding
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  setCardContent: {
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
    position: 'relative',
  },
  setName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  setCount: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  setArrow: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SpecializationSets;
