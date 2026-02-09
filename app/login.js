import { Link } from "expo-router";
import { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../config/authcontest";

export default function LoginScreen() {
  const authState = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authState.LogIn(email, password);
      // Success - user will be redirected by AuthContext
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <SafeAreaView>
        <View>
          <TextInput
            placeholder="email"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
          {error && (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          )}
          <TouchableOpacity onPress={handleSignin} disabled={loading}>
            <Text>{loading ? "Signing in..." : "LOGIN"}</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <Link href={"/signup"}>
              <Text>Don't have an account? Signup</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
