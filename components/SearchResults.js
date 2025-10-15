import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');


const SearchResults = ({ searchResults, searchQuery, onInstrumentSelect }) => {

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
      return '#82E0AA'; // Light green for lobectomy
    } else if (setName.includes('Single')) {
      return '#F1948A'; // Light red for single instruments
    } else {
      return '#D5DBDB'; // Default gray
    }
  };

  if (searchResults.length === 0) {
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No instruments found for "{searchQuery}"</Text>
        <Text style={styles.noResultsSubtext}>Try searching for different terms</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>
          {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.resultsGrid}>
          {searchResults.map((instrument, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resultCard}
              onPress={() => onInstrumentSelect(instrument)}
              activeOpacity={0.8}
            >
              <View style={styles.resultCardContent}>
                <View style={styles.resultHeader}>
                  <View style={styles.instrumentInfo}>
                    <Text style={styles.instrumentName} numberOfLines={2}>
                      {instrument.name}
                    </Text>
                    {instrument.category && (
                      <Text style={styles.instrumentCategory} numberOfLines={1}>
                        {instrument.category}
                      </Text>
                    )}
                  </View>
                </View>
                
                {instrument.brief && (
                  <Text style={styles.instrumentBrief} numberOfLines={2}>
                    {instrument.brief}
                  </Text>
                )}
                
                {/* Show which sets this instrument belongs to */}
                {instrument.sets && instrument.sets.length > 0 && (
                  <View style={styles.setsContainer}>
                    <Text style={styles.setsLabel}>Found in:</Text>
                    <View style={styles.setsList}>
                      {instrument.sets.slice(0, 2).map((setName, setIndex) => (
                        <View 
                          key={setIndex} 
                          style={[
                            styles.setBadge, 
                            { backgroundColor: getSetColor(setName) }
                          ]}
                        >
                          <Text style={styles.setBadgeText} numberOfLines={1}>
                            {setName}
                          </Text>
                        </View>
                      ))}
                      {instrument.sets.length > 2 && (
                        <Text style={styles.moreSetsText}>
                          +{instrument.sets.length - 2} more
                        </Text>
                      )}
                    </View>
                  </View>
                )}
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
  resultsGrid: {
    gap: 12,
  },
  resultCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resultCardContent: {
    padding: 15,
  },
  resultHeader: {
    marginBottom: 8,
  },
  instrumentInfo: {
    flex: 1,
  },
  instrumentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
    lineHeight: 20,
  },
  instrumentCategory: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '600',
  },
  instrumentBrief: {
    fontSize: 13,
    color: '#34495E',
    lineHeight: 18,
    marginBottom: 10,
  },
  setsContainer: {
    marginTop: 5,
  },
  setsLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    fontWeight: '600',
    marginBottom: 6,
  },
  setsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  setBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  setBadgeText: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: '600',
  },
  moreSetsText: {
    fontSize: 10,
    color: '#7F8C8D',
    fontStyle: 'italic',
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

export default SearchResults;
