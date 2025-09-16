import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { supabase } from "../integrations/supabase/client";
import { Link } from "expo-router";

export default function ImageGeneratorScreen() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a prompt.");
      return;
    }

    setLoading(true);
    setImageUrl("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt },
      });

      if (error) {
        throw error;
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.image) {
        setImageUrl(`data:image/png;base64,${data.image}`);
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      Alert.alert("Generation Failed", error.message || "Could not generate image. Please check the logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/" style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back to Home</Text>
      </Link>
      <Text style={styles.title}>AI Image Generator</Text>
      <Text style={styles.subtitle}>
        Enter a prompt to generate an image using Stable Diffusion.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g., A cute cat wearing a wizard hat"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (loading || !prompt.trim()) && styles.buttonDisabled,
            pressed && !loading && styles.buttonPressed,
          ]}
          onPress={generateImage}
          disabled={loading || !prompt.trim()}
        >
          <Text style={styles.buttonText}>Generate</Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Generating your masterpiece...</Text>
        </View>
      )}

      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Text style={styles.resultTitle}>Result:</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backLink: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 50,
    left: 20,
    zIndex: 1,
  },
  backLinkText: {
    fontSize: 16,
    color: '#007BFF',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 60,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    maxWidth: 300,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 500,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    minHeight: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "white",
    textAlignVertical: 'top',
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: "#0056b3",
  },
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  imageContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});