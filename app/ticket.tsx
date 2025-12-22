import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================================
// 🎛️ CONTROL PANEL (LAYOUT CONFIGURATION)
// ============================================================================

const LAYOUT_CONFIG = {
// --- LAYER 1: BLUE HEADER ---
header_Height: 321, // Height of the blue background in pixels
header_Roundness: 12, // Roundness of bottom corners
header_Color: '#4a86e1ff', // The exact blue color

// --- LAYER 2: FLOATING CARD ---
card_SideMargin: 21, // Space from left/right edges
card_TopOffset: 94, // Distance from TOP of screen
card_Height: 687, // Total height of the white card
// --- ELEMENT POSITIONS (Y-Axis from Top of Card) ---
y_QrCode: 19, // Green QR Box position
y_TapToEnlarge: 197, // "Tap to enlarge" text
y_DottedLine: 218, // Dotted line (Should approx match header_Height - card_TopOffset)
y_Interstate: 228, // "INTERSTATE"
y_BigNumber: 269, // "3"
y_ZoneRide: 355, // "ZONE RIDE"
y_Passenger: 386, // "1 Adult"
y_ColorBar: 567, // Tricolor Bar
y_ProgressBar: 598, // Grey/Blue expiration bar
y_ExpiresText: 620, // "Expires in..."
y_Instructions: 669, // Bottom link text

// --- SIZES ---
qr_Size: 151, // Size of the QR Code (Green box is slightly larger)
size_Interstate: 36, // Font size
size_BigNumber: 70, // Font size
size_ZoneRide: 22, // Font size
size_Passenger: 20, // Font size
size_Expires: 22, // Font size
};

// ============================================================================
// ⚠️ LOGIC BELOW
// ============================================================================

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 🛠️ QR GENERATION LOGIC (ADDED)
// Adds padding to force a dense grid
const generateDenseQRData = (baseString: string) => {
const padding = 'X'.repeat(220); // 220 'X' characters
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

// Calculate Card Width explicitly to prevent layout breaking
const cardWidth = SCREEN_WIDTH - (LAYOUT_CONFIG.card_SideMargin * 2);

// Generate the dense data string (ADDED)
const qrValue = generateDenseQRData("NJ_TRANSIT_TICKET_DATA");

return (
<View style={styles.mainContainer}>
<Stack.Screen options={{ headerShown: false }} />
<StatusBar barStyle="light-content" />

{/* --- LAYER 1: Blue Header --- */}
<View style={[styles.blueHeader, {
height: LAYOUT_CONFIG.header_Height,
backgroundColor: LAYOUT_CONFIG.header_Color,
borderBottomLeftRadius: LAYOUT_CONFIG.header_Roundness,
borderBottomRightRadius: LAYOUT_CONFIG.header_Roundness,
}]}>
{/* Navigation Bar (Inside SafeArea) */}
<View style={[styles.navBar, { marginTop: insets.top }]}>
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
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_QrCode }]}>
<View style={[styles.qrFrame, {
width: LAYOUT_CONFIG.qr_Size + 26,
height: LAYOUT_CONFIG.qr_Size + 28
}]}>
<View style={[styles.qrInnerWhite, { padding: 2 }]}>
{/* ✅ UPDATED QR COMPONENT */}
<QRCode
value={qrValue}
size={LAYOUT_CONFIG.qr_Size}
ecl="L" // Matches Swift "L" correction
quietZone={0} // Minimal padding, similar to crop
/>
</View>
</View>
</View>

{/* Tap Text */}
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_TapToEnlarge }]}>
<Text style={styles.tapText}>Tap to enlarge</Text>
</View>

{/* Dotted Line */}
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_DottedLine, width: '100%', paddingHorizontal: 20 }]}>
<View style={styles.dottedLine} />
</View>

{/* DETAILS */}
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_Interstate }]}>
<Text style={[styles.interstateText, { fontSize: LAYOUT_CONFIG.size_Interstate }]}>
INTERSTATE
</Text>
</View>

<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_BigNumber }]}>
<Text style={[styles.bigNumberText, { fontSize: LAYOUT_CONFIG.size_BigNumber }]}>
3
</Text>
</View>

<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_ZoneRide }]}>
<Text style={[styles.zoneRideText, { fontSize: LAYOUT_CONFIG.size_ZoneRide }]}>
ZONE RIDE
</Text>
</View>

<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_Passenger }]}>
<Text style={[styles.passengerText, { fontSize: LAYOUT_CONFIG.size_Passenger }]}>
1 Adult
</Text>
</View>

{/* FOOTER */}
{/* Tri-Color Bar */}
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_ColorBar }]}>
{/* ✅ FIXED: Width is now applied here so it centers correctly */}
<View style={[styles.colorBarContainer, { width: '85%', opacity: blink ? 1 : 0 }]}>
<View style={{ flex: 1, backgroundColor: '#E35237' }} />
<View style={{ flex: 1, backgroundColor: '#EDE6F2' }} />
<View style={{ flex: 1, backgroundColor: '#934598' }} />
</View>
</View>

{/* Progress Bar */}
<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_ProgressBar }]}>
{/* ✅ FIXED: Width is now applied here */}
<View style={[styles.progressBarBg, { width: '85%' }]}>
<View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: LAYOUT_CONFIG.header_Color }]} />
</View>
</View>

<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_ExpiresText }]}>
<Text style={[styles.expiresText, { fontSize: LAYOUT_CONFIG.size_Expires }]}>
Expires in <Text style={{fontWeight: '900'}}>{timeString}</Text>
</Text>
</View>

<View style={[styles.centeredItem, { top: LAYOUT_CONFIG.y_Instructions }]}>
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
height: 30,
},
navTitle: {
color: 'white',
fontSize: 15,
fontWeight: '700',
},
navIcon: {
width: 30,
alignItems: 'center',
},
cardContainer: {
position: 'absolute',
backgroundColor: 'white',
borderRadius: 16,
zIndex: 10,
// Shadows
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
borderColor: '#D3D3D3', // Light Grey
borderRadius: 1,
},
interstateText: {
fontWeight: '900',
color: '#f83026ff', // Red
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