import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { Link } from "expo-router";

const TIP_URL = "https://www.buymeacoffee.com/shaaraa";

export default function HomeScreen() {
  const handleTipPress = async () => {
    try {
      const supported = await Linking.canOpenURL(TIP_URL);
      if (supported) await Linking.openURL(TIP_URL);
      else console.warn("Cannot open:", TIP_URL);
    } catch (e) {
      console.warn("Open URL failed:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Dyad React Native (Expo)
      </Text>

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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
  },
});