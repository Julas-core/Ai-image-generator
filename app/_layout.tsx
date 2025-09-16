import { Stack, useRouter, usePathname } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Layout = () => {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    // If the user is not signed in and not on the login page, redirect them.
    if (!session && pathname !== "/login") {
      router.replace("/login");
    } 
    // If the user is signed in and on the login page, redirect them to home.
    else if (session && pathname === "/login") {
      router.replace("/");
    }
  }, [session, loading, pathname]);

  // Show a loading indicator while checking for a session
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})