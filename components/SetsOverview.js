import React from 'react';
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SetsOverview = ({ onSetSelect, onBackToSearch }) => {
  const handleSetPress = (setData) => {
    onSetSelect(setData);
  };

  // Debug logging
  console.log('SetsOverview - setsOverview:', setsOverview);
  console.log('SetsOverview - setsOverview type:', typeof setsOverview);
  console.log('SetsOverview - setsOverview length:', setsOverview?.length);

  // Safety check
  if (!setsOverview || !Array.isArray(setsOverview)) {
    console.error('SetsOverview - setsOverview is not a valid array:', setsOverview);
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading sets data</Text>
      </View>
    );
  }


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

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.setsGrid}>
          {setsOverview.sort((a, b) => a.name.localeCompare(b.name)).map((setData, index) => (
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
                <Text style={styles.setName} numberOfLines={3}>
                  {setData.name}
                </Text>
                <Text style={styles.setCount}>
                  {setData.count} {setData.count === 1 ? 'instrument' : 'instruments'}
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
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 50,
    padding: 20,
  },
});

export default SetsOverview;
