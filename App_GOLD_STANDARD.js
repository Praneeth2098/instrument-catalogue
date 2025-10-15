import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, StatusBar, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import InstrumentCard from './components/InstrumentCard';
import ScrollTest from './components/ScrollTest';
import SimpleTest from './components/SimpleTest';
import { fetchInstrumentsFromGoogleSheet } from './services/googleSheetsService';
import { uniqueInstruments } from './data/uniqueInstruments';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (currentIndex < instruments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to beginning
      setCurrentIndex(0);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to end
      setCurrentIndex(instruments.length - 1);
    }
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
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Header with instrument count and refresh button */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {instruments.length} Unique Instruments
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={loadInstruments}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            {instruments.length > 0 ? (
              <InstrumentCard
                instrument={instruments[currentIndex]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
              />
            ) : (
              <Text style={styles.errorText}>No instruments loaded</Text>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  scrollContainer: {
    flex: 1,
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#2C3E50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    padding: 20,
  },
});

