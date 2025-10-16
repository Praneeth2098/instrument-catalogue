import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, StatusBar, Text, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import InstrumentCard from './components/InstrumentCard';
import SetsOverview from './components/SetsOverview';
import SetDetail from './components/SetDetail';
import SearchResults from './components/SearchResults';
import SpecializationsOverview from './components/SpecializationsOverview';
import SpecializationSets from './components/SpecializationSets';
import { fetchInstrumentsFromGoogleSheet } from './services/googleSheetsService';
import { uniqueInstruments } from './data/uniqueInstruments';
import { completeInstrumentsData } from './data/completeInstrumentsData';
import { setsOverview } from './data/setsOverview';

// Debug logging for imports
console.log('App.js - setsOverview import:', setsOverview);
console.log('App.js - setsOverview type:', typeof setsOverview);
console.log('App.js - setsOverview length:', setsOverview?.length);
import { Colors, dashboardColors } from './constants/colors';
import Fonts from './constants/fonts';
import { moderateScale } from 'react-native-size-matters';
import { ColorProvider, useColorContext } from './contexts/ColorContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const AppContent = () => {
  const { updateSpecializationColor, getBannerGradientColors } = useColorContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [instruments, setInstruments] = useState([]);
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('text'); // 'text', 'image'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('specializations'); // 'search', 'specializations', 'specializationSets', 'overview', 'setDetail', 'card', 'searchPage'
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [currentSetInstruments, setCurrentSetInstruments] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [previousView, setPreviousView] = useState(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Google Sheet ID - Replace this with your actual Google Sheet ID
  const GOOGLE_SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

  useEffect(() => {
    loadInstruments();
  }, []);

  const loadInstruments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the unique instruments data extracted from the dataset
      console.log('Loading instruments...', uniqueInstruments ? uniqueInstruments.length : 'No data');
      if (uniqueInstruments && uniqueInstruments.length > 0) {
        setInstruments(uniqueInstruments);
        setFilteredInstruments(uniqueInstruments);
        console.log(`✅ Loaded ${uniqueInstruments.length} unique instruments from dataset`);
        console.log('First instrument:', uniqueInstruments[0]?.name);
      } else {
        // Fallback to Google Sheets if available
        const fetchedInstruments = await fetchInstrumentsFromGoogleSheet(GOOGLE_SHEET_ID);
        
        if (fetchedInstruments && fetchedInstruments.length > 0) {
          setInstruments(fetchedInstruments);
        } else {
          setError('No instruments found');
        }
      }
    } catch (err) {
      console.error('Error loading instruments:', err);
      setError('Failed to load instruments');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = () => {
    if (currentView === 'card' && currentSetInstruments && currentSetInstruments.length > 0) {
      // Swipe between instruments in the current set
      if (currentSetIndex < currentSetInstruments.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setSelectedInstrument(currentSetInstruments[currentSetIndex + 1]);
      } else {
        // Loop back to beginning
        setCurrentSetIndex(0);
        setSelectedInstrument(currentSetInstruments[0]);
      }
    } else {
      // Original behavior for search results
      const currentResults = searchQuery.trim() !== '' ? globalSearchResults : filteredInstruments;
      if (currentIndex < currentResults.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Loop back to beginning
        setCurrentIndex(0);
      }
    }
  };

  const handleSwipeRight = () => {
    if (currentView === 'card' && currentSetInstruments && currentSetInstruments.length > 0) {
      // Swipe between instruments in the current set
      if (currentSetIndex > 0) {
        setCurrentSetIndex(currentSetIndex - 1);
        setSelectedInstrument(currentSetInstruments[currentSetIndex - 1]);
      } else {
        // Loop to end
        setCurrentSetIndex((currentSetInstruments?.length || 1) - 1);
        setSelectedInstrument(currentSetInstruments[(currentSetInstruments?.length || 1) - 1]);
      }
    } else {
      // Original behavior for search results
      const currentResults = searchQuery.trim() !== '' ? globalSearchResults : filteredInstruments;
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else {
        // Loop to end
        setCurrentIndex(currentResults.length - 1);
      }
    }
  };

  // Global search functionality
  const performGlobalSearch = (query) => {
    if (!query || query.trim() === '') {
      return {
        specializations: [],
        sets: [],
        instruments: []
      };
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

    // Search instruments
    const instruments = completeInstrumentsData.instruments.filter(instrument => {
      return (
        instrument.name.toLowerCase().includes(searchTerm) ||
        instrument.category.toLowerCase().includes(searchTerm) ||
        (instrument.description && instrument.description.toLowerCase().includes(searchTerm)) ||
        (instrument.usage && instrument.usage.toLowerCase().includes(searchTerm)) ||
        (instrument.features && instrument.features.some(feature => feature.toLowerCase().includes(searchTerm))) ||
        (instrument.sets && instrument.sets.some(set => set.toLowerCase().includes(searchTerm)))
      );
    });

    return { specializations, sets, instruments };
  };

  const getSpecializationColor = (specialization) => {
    // Fixed color mapping to ensure consistency
    const colors = {
      'Orthopedic Surgery': '#4ECDC4',
      'General Anesthesia': '#FF6B6B',
      'General Surgery': '#45B7D1',
      'Cardiothoracic Surgery': '#96CEB4',
      'Cardiac Surgery': '#96CEB4', // Same as Cardiothoracic
      'Neurosurgery': '#F39C12',
      'ENT Surgery': '#9B59B6',
      'Thoracic Surgery': '#E67E22',
      'Others': '#95A5A6'
    };
    return colors[specialization] || '#95A5A6';
  };

  // Removed local getBannerGradientColors - now using context version

  const getDarkerShade = (hexColor) => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken by 20%
    const darkenedR = Math.max(0, Math.floor(r * 0.8));
    const darkenedG = Math.max(0, Math.floor(g * 0.8));
    const darkenedB = Math.max(0, Math.floor(b * 0.8));
    
    // Convert back to hex
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredInstruments(instruments);
      setGlobalSearchResults([]);
      setCurrentIndex(0);
    } else {
      // Search in the current instruments (for search view)
      const filtered = instruments.filter(instrument => 
        instrument.name.toLowerCase().includes(query.toLowerCase()) ||
        instrument.category.toLowerCase().includes(query.toLowerCase()) ||
        instrument.description.toLowerCase().includes(query.toLowerCase()) ||
        instrument.features.some(feature => feature.toLowerCase().includes(query.toLowerCase())) ||
        instrument.usage.toLowerCase().includes(query.toLowerCase()) ||
        instrument.material.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredInstruments(filtered);
      setCurrentIndex(0);
      
      // Global search across all instruments from complete data
      const globalResults = completeInstrumentsData.instruments.filter(instrument => {
        const searchTerm = query.toLowerCase();
        return (
          instrument.name.toLowerCase().includes(searchTerm) ||
          instrument.category.toLowerCase().includes(searchTerm) ||
          instrument.description.toLowerCase().includes(searchTerm) ||
          instrument.usage.toLowerCase().includes(searchTerm) ||
          instrument.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
          instrument.sets.some(set => set.toLowerCase().includes(searchTerm))
        );
      });
      setGlobalSearchResults(globalResults);
    }
  };

  // Navigate to search page with query
  const handleNavigateToSearch = (query) => {
    setPreviousView(currentView);
    setSearchQuery(query);
    setCurrentView('searchPage');
    
    // Perform the search and set results
    const results = performGlobalSearch(query);
    setGlobalSearchResults(results.instruments);
  };


  const handleShowOverview = () => {
    setCurrentView('overview');
  };

  const handleBackToSearch = () => {
    setCurrentView('searchPage');
    setSelectedSet(null);
  };

  const handleSpecializationSelect = (specialization) => {
    setSelectedSpecialization(specialization);
    setCurrentView('specializationSets');
    // Update color context immediately to prevent temporary wrong color display
    updateSpecializationColor(specialization.name);
  };

  const handleBackToSpecializations = () => {
    setCurrentView('specializations');
    setSelectedSpecialization(null);
  };

  const handleBackToSpecializationsFromSet = () => {
    setCurrentView('specializationSets');
    setSelectedSet(null);
  };

  const handleSetSelect = (setData) => {
    console.log('🎨 handleSetSelect called with setData:', setData);
    console.log('🎨 setData.hasSpeciality:', setData.hasSpeciality);
    console.log('🎨 setData.speciality:', setData.speciality);
    
    setSelectedSet(setData);
    setCurrentView('setDetail');
    
    // Update color context based on set's specialization
    if (setData.hasSpeciality && setData.speciality) {
      console.log('🎨 Updating color to specialization:', setData.speciality);
      updateSpecializationColor(setData.speciality);
    } else {
      console.log('🎨 Updating color to Others');
      updateSpecializationColor('Others');
    }
  };

  const handleSetSelectFromSearch = (setData) => {
    // If the set has a speciality, find the specialization and navigate to it
    if (setData.hasSpeciality && setData.speciality) {
      // Find the specialization that contains this set
      const specialization = setsOverview
        .filter(set => set.speciality === setData.speciality)
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
        }, [])[0];
      
      if (specialization) {
        setSelectedSpecialization(specialization);
        setCurrentView('specializationSets');
        updateSpecializationColor(specialization.name);
        return;
      }
    }
    
    // If no speciality or specialization not found, go to "Others" specialization
    const othersSpecialization = {
      name: 'Others',
      sets: setsOverview.filter(set => !set.hasSpeciality || !set.speciality),
      count: setsOverview.filter(set => !set.hasSpeciality || !set.speciality).reduce((sum, s) => sum + s.count, 0),
      color: '#95A5A6'
    };
    
    setSelectedSpecialization(othersSpecialization);
    setCurrentView('specializationSets');
    updateSpecializationColor('Others');
  };

  const handleSetSelectFromCard = (setName) => {
    // Find the set data from setsOverview
    const setData = setsOverview.find(set => set.name === setName);
    if (setData) {
      handleSetSelect(setData);
    }
  };

  const handleInstrumentSelect = (instrument) => {
    setSelectedInstrument(instrument);
    setCurrentView('card');
    setPreviousView(null); // Clear previous view when going to card
    // Clear search when selecting an instrument
    setSearchQuery('');
    setGlobalSearchResults([]);
    
    // Load instruments from the same set for swiping
    if (selectedSet) {
      // Filter instruments that belong to this set
      const setInstruments = completeInstrumentsData.instruments.filter(inst => 
        inst.sets && inst.sets.includes(selectedSet.name)
      );
      setCurrentSetInstruments(setInstruments);
      // Find the index of the selected instrument in the set
      const instrumentIndex = setInstruments.findIndex(inst => inst.name === instrument.name);
      setCurrentSetIndex(instrumentIndex >= 0 ? instrumentIndex : 0);
    } else {
      // If coming from search results, find which set this instrument belongs to
      const instrumentSets = instrument.sets || [];
      if (instrumentSets.length > 0) {
        // Use the first set this instrument belongs to
        const firstSetName = instrumentSets[0];
        const setData = setsOverview.find(set => set.name === firstSetName);
        
        if (setData) {
          setSelectedSet(setData);
          
          // Set the specialization context based on the set's speciality
          if (setData.hasSpeciality && setData.speciality) {
            const specialization = setsOverview
              .filter(set => set.speciality === setData.speciality)
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
              }, [])[0];
            
            if (specialization) {
              setSelectedSpecialization(specialization);
            }
          } else {
            // Set belongs to "Others" specialization
            const othersSpecialization = {
              name: 'Others',
              sets: setsOverview.filter(set => !set.hasSpeciality || !set.speciality),
              count: setsOverview.filter(set => !set.hasSpeciality || !set.speciality).reduce((sum, s) => sum + s.count, 0),
              color: '#95A5A6'
            };
            setSelectedSpecialization(othersSpecialization);
          }
          
          // Filter instruments that belong to this set
          const setInstruments = completeInstrumentsData.instruments.filter(inst => 
            inst.sets && inst.sets.includes(firstSetName)
          );
          setCurrentSetInstruments(setInstruments);
          // Find the index of the selected instrument in the set
          const instrumentIndex = setInstruments.findIndex(inst => inst.name === instrument.name);
          setCurrentSetIndex(instrumentIndex >= 0 ? instrumentIndex : 0);
        } else {
          // Fallback: just show the single instrument
          setCurrentSetInstruments([instrument]);
          setCurrentSetIndex(0);
          setSelectedSet({ name: 'Single Instrument', count: 1 });
        }
      } else {
        // Fallback: just show the single instrument
        setCurrentSetInstruments([instrument]);
        setCurrentSetIndex(0);
        setSelectedSet({ name: 'Single Instrument', count: 1 });
      }
    }
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedSet(null);
    setSelectedInstrument(null);
    setCurrentSetInstruments([]);
    setCurrentSetIndex(0);
  };

  const handleBackToSetDetail = () => {
    setCurrentView('setDetail');
    setSelectedInstrument(null);
    setCurrentSetInstruments([]);
    setCurrentSetIndex(0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setGlobalSearchResults([]);
    setCurrentIndex(0);
  };


  // Show loading state
  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2E86AB" />
              <Text style={styles.loadingText}>Loading instruments...</Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Show error state
  if (error) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.errorSubtext}>
                Please check your Google Sheet ID and ensure the sheet is published.
              </Text>
              <Text style={styles.retryText} onPress={loadInstruments}>
                Tap to retry
              </Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Show main app
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LinearGradient
          colors={currentView === 'specializations' ? getBannerGradientColors(true) : getBannerGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fullScreenGradient}
        >
          <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor={currentView === 'specializations' ? getBannerGradientColors(true)[0] : getBannerGradientColors()[0]} />
            
            {/* Top Banner */}
            <View style={styles.topBanner}>
              <View style={styles.bannerContent}>
                {(currentView === 'specializationSets' || currentView === 'setDetail' || currentView === 'card' || currentView === 'searchPage') && (
                  <TouchableOpacity 
                    style={styles.backArrow} 
                    onPress={
                      currentView === 'specializationSets' ? handleBackToSpecializations :
                      currentView === 'setDetail' ? handleBackToSpecializationsFromSet :
                      currentView === 'searchPage' ? () => setCurrentView(previousView || 'specializations') :
                      handleBackToSetDetail
                    }
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  >
                    <Text style={styles.backArrowText}>←</Text>
                  </TouchableOpacity>
                )}
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>
                  {searchQuery.trim() !== '' ? 
                    `${globalSearchResults?.length || 0} Search Results` :
                    currentView === 'specializations' ? 'Surgical Specializations' :
                    currentView === 'specializationSets' ? selectedSpecialization?.name || 'Specialization Sets' :
                    currentView === 'overview' ? 'Surgical Sets Overview' :
                    currentView === 'setDetail' ? selectedSet?.name || 'Set Details' :
                    currentView === 'card' ? selectedSet?.name || 'Set Details' :
                    currentView === 'searchPage' ? 'Search Instruments' :
                    'Surgical Specializations'}
                  </Text>
                  <Text style={styles.bannerSubtitle}>
                    {searchQuery.trim() !== '' ? 
                      `Found ${globalSearchResults?.length || 0} matching instruments` :
                      currentView === 'specializations' ? 'Browse surgical sets by specialization' :
                      currentView === 'specializationSets' ? `${selectedSpecialization?.sets?.length || 0} sets • ${selectedSpecialization?.count || 0} instruments` :
                      currentView === 'overview' ? '17 sets • 210 total instruments' :
                      currentView === 'setDetail' ? `${selectedSet?.count || 0} instruments in this set` :
                      currentView === 'card' ? `${selectedInstrument?.name || 'Instrument'} • ${currentSetIndex + 1} of ${currentSetInstruments?.length || 0}` :
                      currentView === 'searchPage' ? 'Search for instruments by name, category, or features' :
                      'Browse surgical sets by specialization'}
                  </Text>
                </View>
              </View>
            </View>

            {/* White Curved Content Area */}
            <View style={styles.whiteContentArea}>
              
              
              
              {/* Main Content Area */}
              <View style={styles.mainContent}>
            {searchQuery.trim() !== '' ? (
              // Global search results list view
              <SearchResults
                searchResults={globalSearchResults}
                searchQuery={searchQuery}
                onInstrumentSelect={handleInstrumentSelect}
              />
            ) : currentView === 'specializations' ? (
              <SpecializationsOverview 
                onSpecializationSelect={handleSpecializationSelect}
                onBackToSearch={handleBackToSearch}
                onSetSelect={handleSetSelect}
                onSetSelectFromSearch={handleSetSelectFromSearch}
                onInstrumentSelect={handleInstrumentSelect}
              />
            ) : currentView === 'specializationSets' ? (
              <SpecializationSets
                specialization={selectedSpecialization}
                onSetSelect={handleSetSelect}
                onSetSelectFromSearch={handleSetSelectFromSearch}
                onBackToSpecializations={handleBackToSpecializations}
                onInstrumentSelect={handleInstrumentSelect}
              />
            ) : currentView === 'overview' ? (
              <SetsOverview 
                onSetSelect={handleSetSelect}
                onBackToSearch={handleBackToSearch}
              />
            ) : currentView === 'setDetail' ? (
              <SetDetail
                setData={selectedSet}
                onInstrumentSelect={handleInstrumentSelect}
                onBackToOverview={handleBackToOverview}
                onSetSelect={handleSetSelect}
                onSetSelectFromSearch={handleSetSelectFromSearch}
                specializationColor={selectedSpecialization?.color}
              />
            ) : currentView === 'card' ? (
              <View style={styles.cardContainer}>
                {selectedInstrument ? (
                  <InstrumentCard
                    instrument={selectedInstrument}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSetSelect={handleSetSelectFromCard}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                  />
                ) : (
                  <Text style={styles.errorText}>No instrument selected</Text>
                )}
              </View>
            ) : currentView === 'searchPage' ? (
              <View style={styles.searchPageContainer}>
                <View style={styles.searchBarSection}>
                  <View style={styles.searchBarContainer}>
                    <TextInput
                      style={styles.searchBar}
                      placeholder="Search instruments by name, category, features, sets..."
                      value={searchQuery}
                      onChangeText={handleSearch}
                      placeholderTextColor="#95A5A6"
                    />
                    {searchQuery.trim() !== '' && (
                      <TouchableOpacity style={styles.clearSearchButton} onPress={handleClearSearch}>
                        <Text style={styles.clearSearchButtonText}>Clear</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <SearchResults
                  searchResults={globalSearchResults}
                  searchQuery={searchQuery}
                  onInstrumentSelect={handleInstrumentSelect}
                />
              </View>
            ) : (
              // Search view (default)
              <View style={styles.cardContainer}>
                {filteredInstruments.length > 0 ? (
                  <InstrumentCard
                    instrument={filteredInstruments[currentIndex]}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSetSelect={handleSetSelectFromCard}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                  />
                ) : searchMode === 'text' && searchQuery.trim() !== '' ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No instruments found for "{searchQuery}"</Text>
                    <Text style={styles.noResultsSubtext}>Try searching for different terms</Text>
                  </View>
                ) : (
                  <Text style={styles.errorText}>No instruments loaded</Text>
                )}
              </View>
            )}
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fullScreenGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 0,
  },
  whiteContentArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    marginTop: moderateScale(10),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(20),
    marginBottom: 0,
  },
  topBanner: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
  },
  bannerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: moderateScale(60),
    flexDirection: 'row',
    zIndex: 1,
  },
  bannerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bannerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(10),
  },
  headerSearchIconButton: {
    position: 'absolute',
    right: moderateScale(-15), // Moved left from -25 to -15
    top: moderateScale(-10), // Moved down from -20 to -10
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(6),
    zIndex: 1,
  },
  headerSearchIcon: {
    fontSize: moderateScale(14),
    color: '#FFFFFF',
  },
  backArrow: {
    position: 'absolute',
    left: moderateScale(-25),
    top: moderateScale(-20), // Move arrow much higher up, above the text
    padding: moderateScale(8),
    zIndex: 1,
  },
  backArrowText: {
    color: dashboardColors.dashboardCardWhite,
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  bannerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: dashboardColors.dashboardCardWhite,
    marginBottom: moderateScale(3),
    textAlign: 'center',
  },
  bannerSubtitle: {
    fontSize: moderateScale(13),
    fontWeight: 'normal',
    color: dashboardColors.dashboardCardWhite,
    opacity: 0.8,
    textAlign: 'center',
  },
  searchBarSection: {
    paddingHorizontal: moderateScale(10),
    paddingBottom: moderateScale(20),
  },
  searchPageContainer: {
    flex: 1,
  },
  searchIconContainer: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(10),
    alignItems: 'flex-end',
  },
  searchIconButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: {
    fontSize: moderateScale(16),
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'flex-start',
    paddingTop: moderateScale(50),
  },
  searchOverlayContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(15),
    padding: moderateScale(20),
    maxHeight: '80%',
  },
  searchResultsOverlay: {
    marginTop: moderateScale(15),
    maxHeight: moderateScale(400),
  },
  closeSearchButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: moderateScale(15),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(8),
    marginLeft: moderateScale(10),
  },
  closeSearchButtonText: {
    color: '#666666',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  searchControlsGradient: {
    paddingBottom: 0,
  },
  searchControls: {
    backgroundColor: 'transparent',
    paddingTop: moderateScale(15),
    paddingBottom: moderateScale(8),
  },
  overviewButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  overviewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clearSearchButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchButtonText: {
    color: '#666666',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  backToSetButton: {
    backgroundColor: '#E67E22',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  backToSetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  setDetailContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  setDetailCount: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scrollContainer: {
    flex: 1,
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: moderateScale(16),
    fontSize: moderateScale(16),
    fontWeight: 'normal',
    color: dashboardColors.dashboardHeaderText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: dashboardColors.dashboardCardGradientBlue,
    textAlign: 'center',
    marginBottom: moderateScale(12),
  },
  errorSubtext: {
    fontSize: moderateScale(14),
    fontWeight: 'normal',
    color: dashboardColors.dashboardHeaderText,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: moderateScale(20),
    lineHeight: moderateScale(20),
  },
  retryText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: dashboardColors.dashboardCardBlue,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    padding: 20,
  },
  searchBarContainer: {
    marginHorizontal: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  searchBar: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(15),
    fontSize: moderateScale(16),
    fontWeight: 'normal',
    color: '#333333',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: dashboardColors.dashboardHeaderText,
    textAlign: 'center',
    marginBottom: moderateScale(8),
  },
  noResultsSubtext: {
    fontSize: moderateScale(14),
    fontWeight: 'normal',
    color: dashboardColors.dashboardHeaderText,
    opacity: 0.7,
    textAlign: 'center',
  },
});

// Main App component with ColorProvider
export default function App() {
  return (
    <ColorProvider>
      <AppContent />
    </ColorProvider>
  );
}

