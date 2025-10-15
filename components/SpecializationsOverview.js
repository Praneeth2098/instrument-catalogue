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
import { setsOverview } from '../data/setsOverview';
import { uniqueInstruments } from '../data/uniqueInstruments';
import { Colors, dashboardColors } from '../constants/colors';
import Fonts from '../constants/fonts';
import { moderateScale } from 'react-native-size-matters';
import SearchBar from './SearchBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SpecializationsOverview = ({ onSpecializationSelect, onBackToSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group sets by specialization
  const getSpecializations = () => {
    const specializations = {};
    
    // Initialize with "Others" category for sets without speciality
    specializations['Others'] = {
      name: 'Others',
      sets: [],
      count: 0,
      color: '#95A5A6' // Gray color for others
    };
    
    // Process each set
    setsOverview.forEach(set => {
      if (set.hasSpeciality && set.speciality) {
        // Use the specialty directly from the set data
        const spec = set.speciality;
        
        if (!specializations[spec]) {
          specializations[spec] = {
            name: spec,
            sets: [],
            count: 0,
            color: getSpecializationColor(spec)
          };
        }
        specializations[spec].sets.push(set);
        specializations[spec].count += set.count;
      } else {
        // Add to Others category
        specializations['Others'].sets.push(set);
        specializations['Others'].count += set.count;
      }
    });
    
    // Sort specializations alphabetically, but keep "Others" at the end
    const sortedSpecializations = Object.values(specializations).sort((a, b) => {
      if (a.name === 'Others') return 1; // Others always last
      if (b.name === 'Others') return -1; // Others always last
      return a.name.localeCompare(b.name); // Alphabetical for others
    });
    
    return sortedSpecializations;
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      'Orthopedic Surgery': '#4ECDC4', // Teal
      'General Anesthesia': '#FF6B6B', // Red
      'General Surgery': '#45B7D1', // Blue
      'Cardiothoracic Surgery': '#96CEB4', // Green
      'Neurosurgery': '#F39C12', // Orange
      'ENT Surgery': '#9B59B6', // Purple
      'Others': '#95A5A6' // Gray
    };
    return colors[specialization] || '#95A5A6';
  };

  const allSpecializations = getSpecializations();
  
  // Filter specializations based on search query
  const filteredSpecializations = allSpecializations.filter(specialization => 
    specialization.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Debug logging
  console.log('🔍 SpecializationsOverview - setsOverview length:', setsOverview.length);
  console.log('🔍 SpecializationsOverview - specializations count:', allSpecializations.length);
  console.log('🔍 SpecializationsOverview - specializations names:', allSpecializations.map(s => s.name));
  console.log('🔍 SpecializationsOverview - first set specialty:', setsOverview[0]?.speciality);

  const handleSpecializationPress = (specialization) => {
    onSpecializationSelect(specialization);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search specializations..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.specializationsGrid}>
          {filteredSpecializations.map((specialization, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.specializationCard,
                { backgroundColor: specialization.color }
              ]}
              onPress={() => handleSpecializationPress(specialization)}
              activeOpacity={0.8}
            >
              <View style={styles.specializationCardContent}>
                <Text style={styles.specializationName}>
                  {specialization.name}
                </Text>
                <Text style={styles.specializationCount}>
                  {specialization.sets.length} sets • {specialization.count} instruments
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
  specializationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specializationCard: {
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
  specializationCardContent: {
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
    position: 'relative',
  },
  specializationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 22,
    textAlign: 'center',
  },
  specializationCount: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  specializationArrow: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default SpecializationsOverview;
