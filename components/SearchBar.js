import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const SearchBar = ({ 
  placeholder = "Search", 
  value, 
  onChangeText, 
  onClear,
  showClearButton = true 
}) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#95A5A6"
          value={value}
          onChangeText={onChangeText}
        />
        {showClearButton && value && value.trim() !== '' && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    fontSize: moderateScale(16),
    color: '#95A5A6',
    marginRight: moderateScale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#333333',
    padding: 0,
  },
  clearButton: {
    marginLeft: moderateScale(10),
    padding: moderateScale(5),
  },
  clearButtonText: {
    fontSize: moderateScale(16),
    color: '#95A5A6',
    fontWeight: 'bold',
  },
});

export default SearchBar;
