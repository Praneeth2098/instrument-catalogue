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
import { completeInstrumentsData } from '../data/completeInstrumentsData';
import { uniqueInstruments } from '../data/uniqueInstruments';
import { Colors, dashboardColors } from '../constants/colors';
import Fonts from '../constants/fonts';
import { moderateScale } from 'react-native-size-matters';
import SearchBar from './SearchBar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SetDetail = ({ setData, onInstrumentSelect, onBackToOverview }) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get the actual instruments for this set from the complete data
  // Filter instruments that belong to this set
  const instruments = completeInstrumentsData.instruments ? 
    completeInstrumentsData.instruments.filter(instrument => 
      instrument.sets && instrument.sets.includes(setData.name)
    ) : [];

  // Get set description from setData
  const setDescription = setData.setDescription || null;

  // Debug logging
  console.log('SetDetail - setData.name:', setData.name);
  console.log('SetDetail - instruments found:', instruments.length);
  console.log('SetDetail - setDescription:', setDescription);
  console.log('SetDetail - completeInstrumentsData.instruments length:', completeInstrumentsData.instruments?.length);

  const handleInstrumentPress = (instrument) => {
    onInstrumentSelect(instrument);
  };

  // Function to extract instrument type from name based on actual patterns
  const getInstrumentType = (name) => {
    const lowerName = name.toLowerCase();
    
    // Forceps (various types)
    if (lowerName.includes('forceps') || lowerName.includes('forcep')) {
      return 'Forceps';
    }
    
    // Scissors
    if (lowerName.includes('scissors') || lowerName.includes('scissor')) {
      return 'Scissors';
    }
    
    // Retractors
    if (lowerName.includes('retractor')) {
      return 'Retractors';
    }
    
    // Clamps
    if (lowerName.includes('clamp')) {
      return 'Clamps';
    }
    
    // Holders
    if (lowerName.includes('holder')) {
      return 'Holders';
    }
    
    // Rongeurs
    if (lowerName.includes('rongeur')) {
      return 'Rongeurs';
    }
    
    // Cutters
    if (lowerName.includes('cutter')) {
      return 'Cutters';
    }
    
    // Levers
    if (lowerName.includes('lever')) {
      return 'Levers';
    }
    
    // Hooks
    if (lowerName.includes('hook')) {
      return 'Hooks';
    }
    
    // Suckers
    if (lowerName.includes('sucker')) {
      return 'Suckers';
    }
    
    // Tips
    if (lowerName.includes('tip')) {
      return 'Tips';
    }
    
    // Spatulas
    if (lowerName.includes('spatula')) {
      return 'Spatulas';
    }
    
    // Sounds
    if (lowerName.includes('sound')) {
      return 'Sounds';
    }
    
    // Cannulas
    if (lowerName.includes('cannula')) {
      return 'Cannulas';
    }
    
    // Trocars
    if (lowerName.includes('trocar')) {
      return 'Trocars';
    }
    
    // Needles
    if (lowerName.includes('needle')) {
      return 'Needles';
    }
    
    // Blades
    if (lowerName.includes('blade')) {
      return 'Blades';
    }
    
    // Knives
    if (lowerName.includes('knife')) {
      return 'Knives';
    }
    
    // Curettes
    if (lowerName.includes('curette')) {
      return 'Curettes';
    }
    
    // Probes
    if (lowerName.includes('probe')) {
      return 'Probes';
    }
    
    // Dilators
    if (lowerName.includes('dilator')) {
      return 'Dilators';
    }
    
    // Speculums
    if (lowerName.includes('speculum')) {
      return 'Speculums';
    }
    
    // Spreaders
    if (lowerName.includes('spreader')) {
      return 'Spreaders';
    }
    
    // Raspatories
    if (lowerName.includes('raspatory')) {
      return 'Raspatories';
    }
    
    // Contractors
    if (lowerName.includes('contractor')) {
      return 'Contractors';
    }
    
    // Osteotomes
    if (lowerName.includes('osteotome')) {
      return 'Osteotomes';
    }
    
    // Mallets
    if (lowerName.includes('mallet')) {
      return 'Mallets';
    }
    
    // Awls
    if (lowerName.includes('awl')) {
      return 'Awls';
    }
    
    // Clips
    if (lowerName.includes('clip')) {
      return 'Clips';
    }
    
    // B.P Handles
    if (lowerName.includes('handle')) {
      return 'B.P Handles';
    }
    
    // Default fallback
    return 'Other';
  };

  // Filter instruments based on search query
  const filteredInstruments = instruments && Array.isArray(instruments) ? 
    instruments.filter(instrument => 
      instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instrument.category && instrument.category.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

  // Group instruments by type
  const groupedInstruments = filteredInstruments.reduce((groups, instrument) => {
    const type = getInstrumentType(instrument.name);
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(instrument);
    return groups;
  }, {});

  // Sort groups alphabetically by category name
  const sortedGroups = Object.keys(groupedInstruments).sort((a, b) => a.localeCompare(b));

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Show message if no instruments found
  if (!instruments || instruments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No instruments found for this set</Text>
          <Text style={styles.emptySubtext}>Set: {setData.name}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search instruments..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onClear={handleClearSearch}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Set Description */}
        {setDescription && (
          <Text style={styles.setDescriptionText}>{setDescription}</Text>
        )}
        
        {sortedGroups.map((groupName) => (
          <View key={groupName} style={styles.groupContainer}>
            <TouchableOpacity
              style={styles.groupHeader}
              onPress={() => toggleGroup(groupName)}
              activeOpacity={0.7}
            >
              <Text style={styles.groupTitle}>
                {groupName} ({groupedInstruments[groupName].length})
              </Text>
              <Text style={styles.expandIcon}>
                {expandedGroups[groupName] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {expandedGroups[groupName] && (
              <View style={styles.instrumentsList}>
                {groupedInstruments[groupName].map((instrument, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.instrumentItem}
                    onPress={() => handleInstrumentPress(instrument)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.instrumentItemContent}>
                      <Text style={styles.instrumentName} numberOfLines={2}>
                        {instrument.name}
                      </Text>
                      {instrument.category && (
                        <Text style={styles.instrumentCategory}>
                          {instrument.category}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.arrowIcon}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
        
        {instruments.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No instruments found in this set</Text>
            <Text style={styles.emptySubtext}>The CSV file may be empty or corrupted</Text>
          </View>
        )}
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
    padding: moderateScale(15),
  },
  groupContainer: {
    marginBottom: moderateScale(10),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(15),
    backgroundColor: dashboardColors.dashboardCardBlue,
    borderRadius: moderateScale(8),
  },
  groupTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: dashboardColors.dashboardCardWhite,
    flex: 1,
  },
  expandIcon: {
    fontSize: moderateScale(16),
    color: dashboardColors.dashboardCardWhite,
    marginLeft: moderateScale(10),
  },
  instrumentsList: {
    backgroundColor: '#FFFFFF',
  },
  instrumentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(15),
    borderBottomWidth: 1,
    borderBottomColor: dashboardColors.dashboardCardGray2,
  },
  instrumentItemContent: {
    flex: 1,
  },
  instrumentName: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: dashboardColors.dashboardHeaderText,
    marginBottom: moderateScale(4),
    lineHeight: moderateScale(18),
  },
  instrumentCategory: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: dashboardColors.dashboardHeaderText,
    opacity: 0.7,
  },
  arrowIcon: {
    fontSize: moderateScale(18),
    color: dashboardColors.dashboardCardGray3,
    marginLeft: moderateScale(10),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: moderateScale(50),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: dashboardColors.dashboardHeaderText,
    marginBottom: moderateScale(10),
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    fontWeight: 'normal',
    color: dashboardColors.dashboardHeaderText,
    opacity: 0.7,
    textAlign: 'center',
  },
  setDescriptionText: {
    fontSize: moderateScale(16),
    color: '#333333',
    lineHeight: moderateScale(24),
    marginTop: moderateScale(-10),
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(4),
  },
});

export default SetDetail;
