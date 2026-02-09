import { Link } from "expo-router";
import { useContext, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../config/authcontest";

export default function SignupScreen() {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authState = useContext(AuthContext)

  const handleSignup = async () => {
    // Basic validation
    if (!email || !password || !firstname) {
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
      await authState.Signup(email, password);
      // Success - user will be redirected by AuthContext
    } catch (err) {
      console.error("Signup error:", err);
   
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
            placeholder="firstname"
            value={firstname}
            onChangeText={setFirstname}
            editable={!loading}
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
          />
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
          <TouchableOpacity onPress={handleSignup}
            disabled={loading}>
            <Text>{loading ? "Creating account..." : "SIGNUP"}</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 10 }}>
            <Link href={"/login"}>
              <Text>Already have an account? Login</Text>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
