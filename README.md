# Surgical Instrument Catalogue

A comprehensive React Native mobile application for browsing and learning about surgical instruments, organized by medical specialties and surgical sets.

## 🏥 Overview

The Surgical Instrument Catalogue is designed to help medical students, residents, and healthcare professionals learn about surgical instruments through an intuitive mobile interface. The app organizes instruments by medical specialties and surgical sets, providing detailed information about each instrument including usage, maintenance, and cleaning procedures.

## ✨ Features

### 📱 Mobile-First Design
- **React Native** cross-platform mobile application
- **Intuitive Navigation** with specialty → sets → instruments hierarchy
- **Search Functionality** across all levels of the app
- **Responsive Design** optimized for mobile devices

### 🏗️ Data Organization
- **6 Medical Specialties**: General Surgery, Orthopedic Surgery, Cardiothoracic Surgery, General Anesthesia, Neurosurgery, ENT Surgery
- **16 Surgical Sets** with detailed descriptions
- **345+ Surgical Instruments** with comprehensive information
- **Real-time Search** across instruments, sets, and specialties

### 📊 Rich Instrument Data
- **Detailed Descriptions** for each instrument
- **Usage Instructions** and best practices
- **Cleaning & Sterilization** procedures
- **Inspection & Maintenance** guidelines
- **Material Specifications** and manufacturer information
- **Reference Images** for visual identification

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Python 3.8+** (for data parsing scripts)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Praneeth2098/instrument-catalogue.git
   cd instrument-catalogue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies** (for data parsing)
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## 📁 Project Structure

```
instrument-catalogue/
├── components/                 # React Native components
│   ├── InstrumentCard.js      # Individual instrument display
│   ├── SearchBar.js          # Reusable search component
│   ├── SearchResults.js      # Search results display
│   ├── SetDetail.js          # Set detail view
│   ├── SetsOverview.js       # Sets overview
│   ├── SpecializationSets.js # Sets within specialty
│   └── SpecializationsOverview.js # Main specialties view
├── constants/                 # App constants
│   ├── colors.js             # Color scheme
│   └── fonts.js              # Font definitions
├── data/                     # Data files
│   ├── completeInstrumentsData.js # Complete instrument dataset
│   ├── setsOverview.js       # Sets overview data
│   └── uniqueInstruments.js  # Unique instruments data
├── instrument_csvs/          # Source CSV files
│   ├── Instrument Description - *.csv
│   └── ...
├── services/                 # External services
│   └── googleSheetsService.js # Google Sheets integration
├── App.js                    # Main application component
├── package.json              # Node.js dependencies
├── requirements.txt          # Python dependencies
├── parse_instruments_comprehensive.py # Data parsing script
└── backend_data_structure.json # Backend API structure
```

## 🔧 Data Management

### Adding New Instruments

1. **Add CSV file** to `instrument_csvs/` directory
2. **Run parsing script**:
   ```bash
   python3 parse_instruments_comprehensive.py
   ```
3. **Restart the app** to load new data

### CSV Format

The app supports two CSV formats:

#### New Format (Recommended)
```csv
SPECIALITY,SET DISCRIPTION,NAME,CATEGORY,BRIEF,DISCRIPTION ,TYPE,USAGE,IMPORTANT CONSIDERATIONS,CLEANING & STERILIZATION,INSPECTION & MAINTENANCE,REFERENCE IMAGES
```

#### Old Format
```csv
NAME,CATEGORY,BRIEF,DISCRIPTION ,TYPE,USAGE,IMPORTANT CONSIDERATIONS,CLEANING & STERILIZATION,INSPECTION & MAINTENANCE,REFERENCE IMAGES
```

### Data Validation

The parsing script automatically:
- ✅ Validates CSV structure
- ✅ Extracts specialty and set descriptions
- ✅ Creates unique instrument entries
- ✅ Generates comprehensive data files
- ✅ Provides parsing reports

## 🎨 Customization

### Adding New Specialties

1. **Update specialty list** in `components/SpecializationsOverview.js`
2. **Add color mapping** in `getSpecializationColor()` function
3. **Update CSV files** with new specialty information
4. **Re-run parsing script**

### Modifying UI Components

- **Colors**: Edit `constants/colors.js`
- **Fonts**: Edit `constants/fonts.js`
- **Layout**: Modify individual component files
- **Styling**: Update StyleSheet objects in components

## 📊 Data Statistics

- **Total Instruments**: 345+
- **Unique Instruments**: 203
- **Surgical Sets**: 16
- **Medical Specialties**: 6
- **CSV Files**: 16

### Specialty Breakdown
- **General Surgery**: 4 sets (52 instruments)
- **Orthopedic Surgery**: 4 sets (102 instruments)
- **Cardiothoracic Surgery**: 4 sets (130 instruments)
- **General Anesthesia**: 1 set (16 instruments)
- **Neurosurgery**: 1 set (4 instruments)
- **ENT Surgery**: 1 set (2 instruments)

## 🔌 Backend Integration

The project includes a comprehensive backend data structure (`backend_data_structure.json`) for:

- **REST API Development**
- **Database Schema Design**
- **Data Validation Rules**
- **CSV Import Guidelines**
- **Error Handling Standards**

### API Endpoints

```javascript
// Sets
GET    /api/sets              // Get all sets
GET    /api/sets/:id          // Get specific set
POST   /api/sets              // Create new set
PUT    /api/sets/:id          // Update set
DELETE /api/sets/:id          // Delete set

// Instruments
GET    /api/instruments       // Get all instruments
GET    /api/instruments/:id   // Get specific instrument
GET    /api/instruments/set/:setName // Get instruments by set
POST   /api/instruments       // Create new instrument
PUT    /api/instruments/:id   // Update instrument
DELETE /api/instruments/:id   // Delete instrument

// Search
GET    /api/search?q=:query   // Search instruments and sets
GET    /api/search/instruments?q=:query // Search instruments only
GET    /api/search/sets?q=:query // Search sets only
```

## 🧪 Development

### Running Tests

```bash
# Run Python tests
python -m pytest

# Run React Native tests (if configured)
npm test
```

### Code Quality

```bash
# Format Python code
black *.py

# Lint Python code
flake8 *.py

# Format JavaScript code
npx prettier --write "**/*.{js,jsx,ts,tsx,json,md}"
```

## 📱 Screenshots

### Main Features
- **Specialties Overview**: Browse by medical specialty
- **Sets View**: View instruments within each specialty
- **Instrument Details**: Detailed information for each instrument
- **Search**: Real-time search across all content

### Navigation Flow
1. **Specialties** → Select medical specialty
2. **Sets** → Choose surgical set
3. **Instruments** → Browse individual instruments
4. **Details** → View comprehensive instrument information

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Praneeth2098** - *Initial work* - [GitHub](https://github.com/Praneeth2098)

## 🙏 Acknowledgments

- Medical professionals who provided instrument specifications
- Open source community for React Native and Expo
- Healthcare institutions for data validation

## 📞 Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

## 🔄 Changelog

### Version 1.0.0
- Initial release
- 6 medical specialties
- 16 surgical sets
- 345+ instruments
- Search functionality
- Mobile-optimized interface

---

**Built with ❤️ for the medical community**