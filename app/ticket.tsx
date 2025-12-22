import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get Device Dimensions for Adaptive Scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// 🎛️ ADAPTIVE CONTROL PANEL
// Values are now percentages (0.0 to 1.0) relative to Screen or Card size
// ============================================================================

const LAYOUT_CONFIG = {
  // --- LAYER 1: BLUE HEADER ---
  header_Height: SCREEN_HEIGHT * 0.38,   // 38% of screen height
  header_Roundness: 12,
  header_Color: '#4a86e1ff',

  // --- LAYER 2: FLOATING CARD ---
  card_SideMargin: 21,
  card_TopOffset: SCREEN_HEIGHT * 0.11,  // Starts 11% down from top
  card_Height: SCREEN_HEIGHT * 0.81,     // Takes up 81% of screen height
  
  // --- ELEMENT POSITIONS (Percentage of CARD HEIGHT) ---
  // Calculated from your previous pixel values (e.g. 19px / 687px = 0.028)
  y_QrCode: 0.028,       
  y_TapToEnlarge: 0.287, 
  y_DottedLine: 0.317,   
  
  y_Interstate: 0.332,   
  y_BigNumber: 0.392,    
  y_ZoneRide: 0.517,     
  y_Passenger: 0.562,    
  
  y_ColorBar: 0.825,     
  y_ProgressBar: 0.870,  
  y_ExpiresText: 0.902,  
  y_Instructions: 0.974, 

  // --- SIZES (Percentage of SCREEN WIDTH) ---
  // Ensures text/QR doesn't get cut off on narrower phones
  qr_Size: SCREEN_WIDTH * 0.38,          
  size_Interstate: SCREEN_WIDTH * 0.09,  
  size_BigNumber: SCREEN_WIDTH * 0.18,   
  size_ZoneRide: SCREEN_WIDTH * 0.056,   
  size_Passenger: SCREEN_WIDTH * 0.051,  
  size_Expires: SCREEN_WIDTH * 0.056,    
};

// ============================================================================
// ⚠️ LOGIC BELOW
// ============================================================================

// 🛠️ QR GENERATION LOGIC
const generateDenseQRData = (baseString: string) => {
  const padding = 'X'.repeat(220); 
  return `${baseString}|${padding}`;
};

export default function TicketPreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Timer Logic
  const [timeLeft, setTimeLeft] = useState(58 * 60 + 41); 
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setBlink((prev) => !prev); 
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const totalDuration = 60 * 60; 
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  // Calculate Card Width
  const cardWidth = SCREEN_WIDTH - (LAYOUT_CONFIG.card_SideMargin * 2);
  const qrValue = generateDenseQRData("NJ_TRANSIT_TICKET_DATA");

  return (
    <View style={styles.mainContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Translucent status bar to prevent black bar issue */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* --- LAYER 1: Blue Header --- */}
      <View style={[styles.blueHeader, { 
        height: LAYOUT_CONFIG.header_Height,
        backgroundColor: LAYOUT_CONFIG.header_Color,
        borderBottomLeftRadius: LAYOUT_CONFIG.header_Roundness,
        borderBottomRightRadius: LAYOUT_CONFIG.header_Roundness,
        // Add padding top for the notch
        paddingTop: insets.top, 
      }]}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navIcon}>
             <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>One Way Ticket</Text>
          <View style={styles.navIcon} /> 
        </View>
      </View>

      {/* --- LAYER 2: Floating Card --- */}
      <View style={[styles.cardContainer, {
        top: LAYOUT_CONFIG.card_TopOffset,
        left: LAYOUT_CONFIG.card_SideMargin,
        width: cardWidth,
        height: LAYOUT_CONFIG.card_Height,
      }]}>
        
        {/* QR Code */}
        {/* Note: We multiply card_Height by the percentage to get the Y position */}
        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_QrCode }]}> 
          <View style={[styles.qrFrame, { 
            width: LAYOUT_CONFIG.qr_Size + 26, 
            height: LAYOUT_CONFIG.qr_Size + 28 
          }]}>
            <View style={[styles.qrInnerWhite, { padding: 2 }]}>
              <QRCode 
                value={qrValue} 
                size={LAYOUT_CONFIG.qr_Size} 
                ecl="L"       
                quietZone={0} 
              />
            </View>
          </View>
        </View>

        {/* Tap Text */}
        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_TapToEnlarge }]}>
          <Text style={styles.tapText}>Tap to enlarge</Text>
        </View>

        {/* Dotted Line */}
        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_DottedLine, width: '100%', paddingHorizontal: 20 }]}>
           <View style={styles.dottedLine} />
        </View>

        {/* DETAILS */}
        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_Interstate }]}>
          <Text style={[styles.interstateText, { fontSize: LAYOUT_CONFIG.size_Interstate }]}>
            INTERSTATE
          </Text>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_BigNumber }]}>
          <Text style={[styles.bigNumberText, { fontSize: LAYOUT_CONFIG.size_BigNumber }]}>
            3
          </Text>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_ZoneRide }]}>
          <Text style={[styles.zoneRideText, { fontSize: LAYOUT_CONFIG.size_ZoneRide }]}>
            ZONE RIDE
          </Text>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_Passenger }]}>
          <Text style={[styles.passengerText, { fontSize: LAYOUT_CONFIG.size_Passenger }]}>
            1 Adult
          </Text>
        </View>

        {/* FOOTER */}
        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_ColorBar }]}>
          <View style={[styles.colorBarContainer, { width: '85%', opacity: blink ? 1 : 0 }]}> 
             <View style={{ flex: 1, backgroundColor: '#E35237' }} />
             <View style={{ flex: 1, backgroundColor: '#EDE6F2' }} />
             <View style={{ flex: 1, backgroundColor: '#934598' }} />
          </View>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_ProgressBar }]}>
          <View style={[styles.progressBarBg, { width: '85%' }]}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: LAYOUT_CONFIG.header_Color }]} />
          </View>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_ExpiresText }]}>
          <Text style={[styles.expiresText, { fontSize: LAYOUT_CONFIG.size_Expires }]}>
            Expires in <Text style={{fontWeight: '900'}}>{timeString}</Text>
          </Text>
        </View>

        <View style={[styles.centeredItem, { top: LAYOUT_CONFIG.card_Height * LAYOUT_CONFIG.y_Instructions }]}>
          <TouchableOpacity>
            <Text style={styles.linkText}>View Onboard Validator Instructions</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  blueHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 31, // Increased slightly for better touch area
  },
  navTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  navIcon: {
    width: 28,
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 16,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  centeredItem: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrFrame: {
    borderRadius: 18,
    borderWidth: 9,
    borderColor: '#A0A0A0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  qrInnerWhite: {
    backgroundColor: 'white',
    padding: 4,
  },
  tapText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  dottedLine: {
    height: 1,
    width: '97%',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 1,
  },
  interstateText: {
    fontWeight: '900',
    color: '#f83026ff',
    letterSpacing: 0.5,
  },
  bigNumberText: {
    fontWeight: '900',
    color: 'black',
  },
  zoneRideText: {
    fontWeight: '800',
    color: 'black',
  },
  passengerText: {
    fontWeight: '700',
    color: 'black',
  },
  colorBarContainer: {
    flexDirection: 'row',
    height: 18,
    width: '100%',
  },
  progressBarBg: {
    height: 3.5,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  expiresText: {
    fontWeight: '700',
    color: 'black',
  },
  linkText: {
    color: '#000000ff',
    textDecorationLine: 'underline',
    fontWeight: '400',
    fontSize: 12,
  },
});