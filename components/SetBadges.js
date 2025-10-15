import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useColorContext } from '../contexts/ColorContext';
import { setsOverview } from '../data/setsOverview';

const { width: screenWidth } = Dimensions.get('window');

const SetBadges = ({ 
  sets, 
  onSetSelect, 
  maxDisplay = 3, 
  showLabel = true,
  labelText = "Found in:",
  style = {}
}) => {
  const [showAllModal, setShowAllModal] = useState(false);
  const { getSpecializationColor } = useColorContext();

  if (!sets || sets.length === 0) {
    return null;
  }

  const getSetColor = (setName) => {
    // Find the set data from setsOverview to get its specialization
    const setData = setsOverview.find(set => set.name === setName);
    
    if (setData && setData.hasSpeciality && setData.speciality) {
      // Use the specialization color for this set
      return getSpecializationColor(setData.speciality);
    } else {
      // Use "Others" color for sets without specialization
      return getSpecializationColor('Others');
    }
  };

  const displayedSets = sets.slice(0, maxDisplay);
  const remainingCount = sets.length - maxDisplay;

  const handleSetPress = (setName) => {
    if (onSetSelect) {
      onSetSelect(setName);
    }
  };

  const handleMorePress = () => {
    setShowAllModal(true);
  };

  const renderSetBadge = (setName, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.setBadge,
        { backgroundColor: getSetColor(setName) }
      ]}
      onPress={() => handleSetPress(setName)}
      activeOpacity={0.7}
    >
      <Text style={styles.setBadgeText} numberOfLines={1}>
        {setName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.setsLabel}>{labelText}</Text>
      )}
      <View style={styles.setsList}>
        {displayedSets.map((setName, index) => renderSetBadge(setName, index))}
        {remainingCount > 0 && (
          <TouchableOpacity
            style={styles.moreButton}
            onPress={handleMorePress}
            activeOpacity={0.7}
          >
            <Text style={styles.moreText}>
              +{remainingCount} more
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for showing all sets */}
      <Modal
        visible={showAllModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAllModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>All Sets</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAllModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalSetsList}>
                {sets.map((setName, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalSetBadge,
                      { backgroundColor: getSetColor(setName) }
                    ]}
                    onPress={() => {
                      handleSetPress(setName);
                      setShowAllModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalSetBadgeText}>
                      {setName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#BDC3C7',
    marginRight: 6,
    marginBottom: 4,
  },
  moreText: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalSetsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 8,
  },
  modalSetBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  modalSetBadgeText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
  },
});

export default SetBadges;
