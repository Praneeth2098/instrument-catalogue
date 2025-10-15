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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SpecializationSets = ({ specialization, onSetSelect, onBackToSpecializations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSetPress = (setData) => {
    onSetSelect(setData);
  };

  // Filter sets based on search query
  const filteredSets = specialization.sets.filter(set => 
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const getSetColor = (setName) => {
    // Color coding based on specialty
    if (setName.includes('Cardiac') || setName.includes('Cardiothoracic')) {
      return '#FF6B6B'; // Red for cardiac
    } else if (setName.includes('Ortho')) {
      return '#4ECDC4'; // Teal for orthopedic
    } else if (setName.includes('Laparoscopy')) {
      return '#45B7D1'; // Blue for laparoscopy
    } else if (setName.includes('Spinal')) {
      return '#96CEB4'; // Green for spinal
    } else if (setName.includes('Hand')) {
      return '#FFEAA7'; // Yellow for hand surgery
    } else if (setName.includes('Thyroid')) {
      return '#DDA0DD'; // Plum for thyroid
    } else if (setName.includes('Tracheostomy')) {
      return '#98D8C8'; // Mint for tracheostomy
    } else if (setName.includes('Thoracotomy')) {
      return '#F7DC6F'; // Light yellow for thoracotomy
    } else if (setName.includes('Osteotomy')) {
      return '#BB8FCE'; // Light purple for osteotomy
    } else if (setName.includes('Incision')) {
      return '#85C1E9'; // Light blue for incision
    } else if (setName.includes('Appendisectomy')) {
      return '#F8C471'; // Orange for appendisectomy
    } else if (setName.includes('Lobectomy')) {
      return '#A8E6CF'; // Light green for lobectomy
    } else if (setName.includes('General')) {
      return '#FFB6C1'; // Light pink for general
    } else {
      return '#95A5A6'; // Default gray
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search sets..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />
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
});

export default SpecializationSets;
