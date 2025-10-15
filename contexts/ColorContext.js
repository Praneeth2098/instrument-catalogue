import React, { createContext, useContext, useState } from 'react';

const ColorContext = createContext();

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};

export const ColorProvider = ({ children }) => {
  const [currentSpecializationColor, setCurrentSpecializationColor] = useState('#0090D6'); // Default blue to match original
  const [currentSpecialization, setCurrentSpecialization] = useState(null);

  const getSpecializationColor = (specialization) => {
    // Fixed color mapping to ensure consistency across all components
    const colors = {
      'Orthopedic Surgery': '#4ECDC4', // Teal
      'General Anesthesia': '#FF6B6B', // Red
      'General Surgery': '#45B7D1', // Blue
      'Cardiothoracic Surgery': '#96CEB4', // Green
      'Cardiac Surgery': '#96CEB4', // Same as Cardiothoracic
      'Neurosurgery': '#F39C12', // Orange
      'ENT Surgery': '#9B59B6', // Purple
      'Thoracic Surgery': '#E67E22', // Dark Orange
      'Others': '#95A5A6' // Gray
    };
    return colors[specialization] || '#95A5A6';
  };

  const updateSpecializationColor = (specialization) => {
    const color = getSpecializationColor(specialization);
    console.log('🎨 ColorContext: Updating color to', specialization, '->', color);
    setCurrentSpecializationColor(color);
    setCurrentSpecialization(specialization);
  };

  const getDarkerShade = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const darkenedR = Math.max(0, Math.floor(r * 0.8));
    const darkenedG = Math.max(0, Math.floor(g * 0.8));
    const darkenedB = Math.max(0, Math.floor(b * 0.8));
    
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
  };

  const getBannerGradientColors = (forceDefault = false) => {
    // Always return original blue gradient for main specializations view
    if (forceDefault) {
      return ['#0090D6', '#375DF9'];
    }
    return [currentSpecializationColor, getDarkerShade(currentSpecializationColor)];
  };

  const value = {
    currentSpecializationColor,
    currentSpecialization,
    getSpecializationColor,
    updateSpecializationColor,
    getDarkerShade,
    getBannerGradientColors,
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};
