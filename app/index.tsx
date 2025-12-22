import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Types ---
type Ticket = {
  id: string;
  zones: string;
  type: string;
  expiration: string;
  status: string;
  statusColor: string; // Helper for text color
};

// --- Mock Data (Full List Matches Screenshot) ---
const MOCK_DATA: Ticket[] = [
  {
    id: '1',
    zones: '3 Zone',
    type: 'One Way Adult (INTRASTATE)',
    expiration: 'Exp: JAN 19, 2026',
    status: 'Non-Active Ticket',
    statusColor: 'white',
  },
  {
    id: '2',
    zones: '3 Zone',
    type: 'One Way Adult (INTRASTATE)',
    expiration: 'Exp: JAN 19, 2026',
    status: 'Non-Active Ticket',
    statusColor: '#A0A0A0', // Dimmed color for used
  },
  {
    id: '3',
    zones: '3 Zone',
    type: 'One Way Adult (INTRASTATE)',
    expiration: 'Exp: DEC 13, 2025 06:15:23 PM',
    status: 'Used Ticket',
    statusColor: '#A0A0A0',
  },
  {
    id: '4',
    zones: '3 Zones',
    type: 'One Way Adult (INTERSTATE)',
    expiration: 'Exp: DEC 14, 2025 12:16:52 AM',
    status: 'Used Ticket',
    statusColor: '#A0A0A0',
  },
  {
    id: '5',
    zones: '3 Zones',
    type: 'One Way Adult (INTERSTATE)',
    expiration: 'Exp: DEC 14, 2025 02:47:13 PM',
    status: 'Used Ticket',
    statusColor: '#A0A0A0',
  },
  {
    id: '6',
    zones: '3 Zone',
    type: 'One Way Adult (INTRASTATE)',
    expiration: 'Exp: DEC 16, 2025 12:51:54 PM',
    status: 'Used Ticket',
    statusColor: '#A0A0A0',
  },
];

export default function MyTicketsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Active' | 'All'>('All');

  // Filter Logic:
  // 'All' shows everything. 'Active' hides 'Used Ticket' (just for demo purposes)
  const displayData = activeTab === 'All' 
    ? MOCK_DATA 
    : MOCK_DATA.filter(t => t.status !== 'Used Ticket');

  // --- Render Item (Ticket Row) ---
  const renderItem = ({ item }: { item: Ticket }) => (
    <TouchableOpacity 
      style={styles.ticketItem} 
      onPress={() => router.push('/ticket')} // Navigates to your ticket.tsx
      activeOpacity={0.7}
    >
      {/* Blue Icon Circle */}
      <View style={styles.iconContainer}>
        <Ionicons name="bus" size={28} color="white" />
      </View>

      {/* Text Content */}
      <View style={styles.ticketContent}>
        <Text style={styles.ticketTitle}>{item.zones}</Text>
        <Text style={styles.ticketSubTitle}>{item.type}</Text>
        <Text style={styles.ticketSubTitle}>{item.expiration}</Text>
        <Text style={[styles.ticketStatus, { color: item.statusColor }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  // --- Separator (The Divider Line) ---
  const renderSeparator = () => (
    <View style={styles.separatorContainer}>
      <View style={styles.separatorLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- Header --- */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Ionicons name="refresh" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Custom Tabs --- */}
        <View style={styles.tabContainer}>
          <View style={styles.segmentWrapper}>
            <TouchableOpacity 
              style={[styles.segmentButton, activeTab === 'Active' && styles.segmentActive]}
              onPress={() => setActiveTab('Active')}
            >
              <Text style={[styles.segmentText, activeTab === 'Active' ? styles.textActive : styles.textInactive]}>
                Active/Non-Active
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.segmentButton, activeTab === 'All' && styles.segmentActive]}
              onPress={() => setActiveTab('All')}
            >
              <Text style={[styles.segmentText, activeTab === 'All' ? styles.textActive : styles.textInactive]}>
                All Tickets
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Section Header (Blue Strip) --- */}
        {activeTab === 'Active' && (
           <View style={styles.sectionHeader}>
             <Text style={styles.sectionHeaderText}>Non-Active Tickets</Text>
           </View>
        )}
      </SafeAreaView>

      {/* --- List View --- */}
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={renderSeparator} // ✅ Adds the line between items
      />

      {/* --- Bottom Navigation --- */}
      <View style={styles.bottomNav}>
        <NavIcon name="star-outline" label="Favorites" />
        <NavIcon name="ticket" label="My Tickets" active />
        <NavIcon name="home-outline" label="Home" />
        <NavIcon name="map-outline" label="Rider Tools" />
        <NavIcon name="ellipsis-horizontal-circle-outline" label="More" />
      </View>
    </View>
  );
}

// Helper for Bottom Nav
const NavIcon = ({ name, label, active }: { name: any, label: string, active?: boolean }) => (
  <View style={styles.navItem}>
    <Ionicons name={name} size={24} color={active ? 'white' : '#8E8E93'} />
    <Text style={[styles.navLabel, { color: active ? 'white' : '#8E8E93' }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerSafe: {
    backgroundColor: 'black',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
  },
  // Tabs
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  segmentWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E', // Dark Grey background
    borderRadius: 9,
    padding: 2,
    height: 32,
  },
  segmentButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  segmentActive: {
    backgroundColor: '#636366', // Lighter Grey for selected
  },
  segmentText: {
    fontSize: 17,
    fontWeight: '600',
  },
  textActive: {
    color: '#FF9F0A', // Orange Text
  },
  textInactive: {
    color: '#8E8E93', // Grey Text
  },
  // Section Header
  sectionHeader: {
    backgroundColor: '#174A98', // Dark Blue Strip
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  // List
  listContent: {
    paddingBottom: 90, // Space for bottom tab bar
  },
  ticketItem: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center', // Aligns icon and text vertically
    backgroundColor: 'black',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2D7CF6', // NJ Transit Blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  ticketContent: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  ticketSubTitle: {
    color: '#C7C7CC',
    fontSize: 13,
    marginBottom: 2,
  },
  ticketStatus: {
    fontWeight: '700',
    fontSize: 13,
    marginTop: 2,
  },
  // SEPARATOR STYLING
  separatorContainer: {
    backgroundColor: 'black',
    paddingLeft: 74, // Offset to start line after the icon
  },
  separatorLine: {
    height: 0.5,
    backgroundColor: '#333333', // Dark grey line
    width: '100%',
  },
  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});