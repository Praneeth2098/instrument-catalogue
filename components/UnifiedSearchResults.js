import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import SetBadges from './SetBadges';

const { width: screenWidth } = Dimensions.get('window');

const UnifiedSearchResults = ({ 
  searchQuery, 
  onSpecializationSelect, 
  onSetSelect, 
  onSetSelectFromSearch,
  onInstrumentSelect,
  onBackToSearch 
}) => {
  // Import data
  const { setsOverview } = require('../data/setsOverview');
  const { completeInstrumentsData } = require('../data/completeInstrumentsData');

  // Perform comprehensive search
  const performSearch = (query) => {
    if (!query || query.trim() === '') {
      return { specializations: [], sets: [], instruments: [] };
    }

    const searchTerm = query.toLowerCase();
    
    // Search specializations
    const specializations = setsOverview
      .filter(set => set.speciality && set.speciality.toLowerCase().includes(searchTerm))
      .reduce((acc, set) => {
        const spec = set.speciality;
        if (!acc.find(s => s.name === spec)) {
          acc.push({
            name: spec,
            sets: setsOverview.filter(s => s.speciality === spec),
            count: setsOverview.filter(s => s.speciality === spec).reduce((sum, s) => sum + s.count, 0),
            color: getSpecializationColor(spec)
          });
        }
        return acc;
      }, []);

    // Search sets
    const sets = setsOverview.filter(set => 
      set.name.toLowerCase().includes(searchTerm) ||
      (set.setDescription && set.setDescription.toLowerCase().includes(searchTerm))
    );

    // Search instruments with comprehensive matching
    const instruments = completeInstrumentsData.instruments.filter(instrument => {
      return (
        instrument.name.toLowerCase().includes(searchTerm) ||
        (instrument.category && instrument.category.toLowerCase().includes(searchTerm)) ||
        (instrument.description && instrument.description.toLowerCase().includes(searchTerm)) ||
        (instrument.brief && instrument.brief.toLowerCase().includes(searchTerm)) ||
        (instrument.usage && instrument.usage.toLowerCase().includes(searchTerm)) ||
        (instrument.features && instrument.features.some(feature => feature.toLowerCase().includes(searchTerm))) ||
        (instrument.sets && instrument.sets.some(set => set.toLowerCase().includes(searchTerm)))
      );
    });

    return { specializations, sets, instruments };
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      'Orthopedic Surgery': '#4ECDC4',
      'General Anesthesia': '#FF6B6B',
      'General Surgery': '#45B7D1',
      'Cardiothoracic Surgery': '#96CEB4',
      'Cardiac Surgery': '#96CEB4',
      'Neurosurgery': '#F39C12',
      'ENT Surgery': '#9B59B6',
      'Thoracic Surgery': '#E67E22',
      'Others': '#95A5A6'
    };
    return colors[specialization] || '#95A5A6';
  };

  const getSetColor = (setName) => {
    if (setName.includes('Cardiac') || setName.includes('Cardiothoracic')) {
      return '#FF6B6B';
    } else if (setName.includes('Ortho')) {
      return '#4ECDC4';
    } else if (setName.includes('Laparoscopy')) {
      return '#45B7D1';
    } else if (setName.includes('Spinal')) {
      return '#96CEB4';
    } else if (setName.includes('Hand')) {
      return '#FFEAA7';
    } else if (setName.includes('Thyroid')) {
      return '#DDA0DD';
    } else if (setName.includes('Tracheostomy')) {
      return '#98D8C8';
    } else if (setName.includes('Thoracotomy')) {
      return '#F7DC6F';
    } else if (setName.includes('Osteotomy')) {
      return '#BB8FCE';
    } else if (setName.includes('Incision')) {
      return '#85C1E9';
    } else if (setName.includes('Appendisectomy')) {
      return '#F8C471';
    } else if (setName.includes('Lobectomy')) {
      return '#82E0AA';
    } else if (setName.includes('Single')) {
      return '#F1948A';
    } else {
      return '#D5DBDB';
    }
  };

  const searchResults = performSearch(searchQuery);
  const totalResults = searchResults.specializations.length + searchResults.sets.length + searchResults.instruments.length;

  if (totalResults === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
        <Text style={styles.noResultsSubtext}>Try searching for different terms</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{searchQuery}"
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Specializations Section */}
        {searchResults.specializations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Specializations ({searchResults.specializations.length})
            </Text>
            {searchResults.specializations.map((specialization, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.specializationCard, { borderLeftColor: specialization.color }]}
                onPress={() => onSpecializationSelect(specialization)}
                activeOpacity={0.8}
              >
                <View style={styles.specializationContent}>
                  <Text style={styles.specializationName}>{specialization.name}</Text>
                  <Text style={styles.specializationCount}>
                    {specialization.count} instruments
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sets Section */}
        {searchResults.sets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Sets ({searchResults.sets.length})
            </Text>
            {searchResults.sets.map((set, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.setCard, { borderLeftColor: getSetColor(set.name) }]}
                onPress={() => onSetSelectFromSearch ? onSetSelectFromSearch(set) : onSetSelect(set)}
                activeOpacity={0.8}
              >
                <View style={styles.setContent}>
                  <Text style={styles.setName}>{set.name}</Text>
                  <Text style={styles.setCount}>{set.count} instruments</Text>
                  {set.setDescription && (
                    <Text style={styles.setDescription} numberOfLines={2}>
                      {set.setDescription}
                    </Text>
                  )}
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Instruments Section */}
        {searchResults.instruments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Instruments ({searchResults.instruments.length})
            </Text>
            {searchResults.instruments.map((instrument, index) => (
              <TouchableOpacity
                key={index}
                style={styles.instrumentCard}
                onPress={() => onInstrumentSelect(instrument)}
                activeOpacity={0.8}
              >
                <View style={styles.instrumentContent}>
                  <Text style={styles.instrumentName}>{instrument.name}</Text>
                  {instrument.category && (
                    <Text style={styles.instrumentCategory}>{instrument.category}</Text>
                  )}
                  {instrument.brief && (
                    <Text style={styles.instrumentBrief} numberOfLines={2}>
                      {instrument.brief}
                    </Text>
                  )}
                  {instrument.sets && instrument.sets.length > 0 && (
                    <SetBadges
                      sets={instrument.sets}
                      onSetSelect={onSetSelect}
                      maxDisplay={2}
                      showLabel={true}
                      labelText="Found in:"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
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
  resultsHeader: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    paddingLeft: 5,
  },
  specializationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  specializationContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specializationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  specializationCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 10,
  },
  setCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  setContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  setName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  setCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  setDescription: {
    fontSize: 13,
    color: '#5D6D7E',
    fontStyle: 'italic',
    marginTop: 5,
    flex: 1,
  },
  instrumentCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  instrumentContent: {
    padding: 15,
  },
  instrumentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  instrumentCategory: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 8,
  },
  instrumentBrief: {
    fontSize: 13,
    color: '#34495E',
    lineHeight: 18,
    marginBottom: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#BDC3C7',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: '#7F8C8D',
    marginBottom: 10,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
  },
});

export default UnifiedSearchResults;
