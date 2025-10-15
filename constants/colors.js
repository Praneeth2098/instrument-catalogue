// Common colors that don't change with theme
export const commonColors = {
  // Brand Colors
  primary: "#00A13A",
  secondary: "#CD0105",

  // Status Colors
  success: "#00A13A",
  error: "#FF0000",
  warning: "#FFA500",
  info: "#0077FF",

  // Grayscale
  black: "#000000",
  white: "#FFFFFF",
  gray50: "#F9FAFB",
  gray100: "#EFF0F6",
  gray200: "#CCCCCC",
  gray300: "#9E9E9E",
  gray400: "#666666",
  gray500: "#454545",
  gray600: "#2C2C2C",
  gray700: "#1A1A1A",

  // Opacity
  blackOpacity60: "rgba(0, 0, 0, 0.6)",
  whiteOpacity60: "rgba(255, 255, 255, 0.6)",

  // Transparent
  transparent: "transparent",
};

const lightColors = {
  // Base
  background: commonColors.white,
  surface: commonColors.white,
  text: commonColors.black,
  textSecondary: commonColors.gray500,

  // Components
  inputBackground: commonColors.white,
  inputBorder: commonColors.gray100,
  inputPlaceholder: commonColors.blackOpacity60,
  inputText: commonColors.black,
  statusBar: "dark-content",

  // Buttons
  buttonPrimary: commonColors.primary,
  buttonSecondary: commonColors.secondary,
  buttonDisabled: commonColors.gray200,

  // Icons
  iconPrimary: commonColors.gray500,
  iconSecondary: commonColors.gray300,
};

const darkColors = {
  // Base
  background: commonColors.gray700,
  surface: commonColors.gray600,
  text: commonColors.white,
  textSecondary: commonColors.gray300,
  statusBar: "light-content",

  // Components
  inputBackground: commonColors.gray600,
  inputBorder: commonColors.gray500,
  inputPlaceholder: commonColors.whiteOpacity60,

  // Buttons
  buttonPrimary: commonColors.primary,
  buttonSecondary: commonColors.secondary,
  buttonDisabled: commonColors.gray500,

  // Icons
  iconPrimary: commonColors.gray300,
  iconSecondary: commonColors.gray400,
};

export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Figma Dashboard-specific colors
export const dashboardColors = {
  dashboardBg: "#D0E5FE", // fill_BWVD13
  dashboardHeaderText: "#001A47", // fill_YBPQ52
  dashboardCardGreen: "#42BE4E", // fill_G0RI6Z
  dashboardCardBlue: "#395DFB", // fill_KD3FPL
  dashboardCardYellow: "#FFECBA", // fill_ISGBPJ
  dashboardCardPink: "#FFA5C1", // fill_YF9ENS
  dashboardCardWhite: "#FFFFFF", // fill_7E3KRK
  dashboardCardGradientBlue: "#375DF9", // fill_C4B0AK (gradient)
  dashboardCardGradientGreen: "#42BE4E", // fill_C4B0AK (gradient)
  dashboardCardGradientCyan: "#00D8E5", // fill_COT2U7 (gradient)
  dashboardCardGradientBlue2: "#375DF9", // fill_COT2U7 (gradient)
  dashboardCardGradientBlue3: "#008FD6", // fill_QAODHS (gradient)
  dashboardCardGradientBlue4: "#375DF9", // fill_QAODHS (gradient)
  dashboardCardGradientCyan2: "#009ECE", // fill_2C5HPR
  dashboardCardBlack: "#000000", // fill_AWH6NL
  dashboardCardGray: "#C2D6F9", // fill_M6C4IE
  dashboardCardGray2: "#F5F5F5", // fill_XPYNAQ
  dashboardCardGray3: "#D9D9D9", // fill_79LITD
  dashboardCoursesGradientBlue: "#375DF9", // fill_US9987 (gradient start)
  dashboardCoursesGradientGreen: "#42BE4E", // fill_US9987 (gradient end)
  dashboardCarouselGradientCyan: "#008FD6", // fill_R6CTO6 (gradient start)
  dashboardCarouselGradientBlue: "#375DF9", // fill_R6CTO6 (gradient end)
  dashboardCarouselGradientCyan2: "#00D8E5", // fill_COT2U7 (gradient start)
  dashboardCarouselGradientBlue2: "#42BE4E", // fill_COT2U7 (gradient end)
  dashboardCarouselButtonBlue: "#009ECE", // fill_VPTKSC
  dashboardMyCoursesGradientBlue: "#375DF9", // fill_8QUFXL (gradient start)
  dashboardMyCoursesGradientGreen: "#42BE4E", // fill_8QUFXL (gradient end)
  dashboardMyCoursesEllipseGreen: "#4ED05F", // fill_KARKGA
  dashboardMyCoursesEllipseBlue: "#4A6DFF", // fill_HX2U1P
  dashboardMyCoursesBottomBg: "#D0E5FE", // fill_WS3KB0
  dashboardCalculatorsBg: "#395DFB", // fill_H2UN61
  dashboardCalculatorsEllipse1: "#4A6DFF", // fill_HX2U1P
  dashboardCalculatorsEllipse2: "#6B88FF", // fill_I38M4R
  dashboardScalesBg: "#42BE4E", // fill_K1UXJE
  dashboardScalesEllipse1: "#67D371", // fill_1MFCPZ
  dashboardScalesEllipse2: "#83EB8C", // fill_3IM1YA
  dashboardScalesEllipseIconBg: "#4ED05F", // fill_EEMTIL
  dashboardGamesBg: "#FFECBA", // fill_K8PZEE
  dashboardGamesEllipse: "#FFA5C1", // fill_XLRYCJ
  dashboardGamesTitleText: "#001A47", // fill_4XE7CH
  dashboardGamesDescText: "#000000", // fill_N9MHDF
  dashboardGamesPlayBtnBg: "#395DFB", // fill_MGUNAP
  dashboardGamesPlayBtnText: "#FFFFFF", // fill_NQSQD1
  dashboardGames2Bg: "#C2D6F9", // new game card background
  dashboardGames3Bg: "#83EB8C", // new game card background
};
