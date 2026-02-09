import { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../../config/authcontest";

export default function Settings() {
  const authState = useContext(AuthContext);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings screen</Text>
      <TouchableOpacity  style={{ marginTop: 10 }} onPress={authState.LogOut}>
        <Text style={{ color: "blue", fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

