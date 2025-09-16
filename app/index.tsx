import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../context/AuthContext";

const TIP_URL = "https://www.buymeacoffee.com/shaaraa";

export default function HomeScreen() {
  const { session } = useAuth();

  const handleTipPress = async () => {
    try {
      const supported = await Linking.canOpenURL(TIP_URL);
      if (supported) await Linking.openURL(TIP_URL);
      else console.warn("Cannot open:", TIP_URL);
    } catch (e) {
      console.warn("Open URL failed:", e);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error signing out", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Dyad React Native (Expo)
      </Text>
      
      {session && <Text style={styles.emailText}>Welcome, {session.user.email}</Text>}

      <Link href="/image-generator" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>AI Image Generator</Text>
        </Pressable>
      </Link>

      <Pressable
        onPress={handleTipPress}
        accessibilityRole="link"
        style={[styles.button, styles.tipButton]}
      >
        <Text style={styles.buttonText}>Tip me</Text>
      </Pressable>

      {session && (
        <Pressable
          onPress={handleSignOut}
          style={[styles.button, styles.signOutButton]}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: 'center',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  tipButton: {
    backgroundColor: "#111",
  },
  signOutButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
  },
});