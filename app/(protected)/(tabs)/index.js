import { useEffect, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function ThinkingIndicator({ name }) {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((dots.length - i) * 150),
        ])
      )
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.thinkingWrapper}>
      <Text style={styles.thinkingText}>{name ?? "Agent"} is thinking</Text>
      <View style={styles.dotsRow}>
        {dots.map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
        ))}
      </View>
    </View>
  );
}

const API_URL = "https://enthymematic-derek-witchingly.ngrok-free.dev"; // ← your machine's current IP

export default function AgentChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askAgent = async () => {
    if (!question.trim()) return;
    

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      const agentMessage = { role: "agent", text: data.answer, name: data.agent_name };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          text: "Could not connect to agent. Is the backend running?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ScrollView style={styles.chat}>
            {messages.map((msg, i) => (
              <View key={i} style={styles.messageWrapper}>
                {msg.role === "agent" && msg.name && (
                  <Text style={styles.agentName}>{msg.name}</Text>
                )}
                <View
                  style={[
                    styles.bubble,
                    msg.role === "user" ? styles.userBubble : styles.agentBubble,
                  ]}
                >
                  <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
              </View>
            ))}
            {loading && <ThinkingIndicator name="Boma" />}
          </ScrollView>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={question}
              onChangeText={setQuestion}
              placeholder="Ask  Boma..."
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={askAgent}>
              <Text style={styles.buttonText}>Ask</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  chat: { flex: 1, padding: 10 },
  messageWrapper: { marginVertical: 5 },
  agentName: { fontSize: 12, fontWeight: "600", color: "#555", marginBottom: 2, marginLeft: 4 },
  bubble: { padding: 12, borderRadius: 12, maxWidth: "80%" },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  agentBubble: { backgroundColor: "#fff", alignSelf: "flex-start" },
  bubbleText: { color: "#000", fontSize: 15 },
  thinkingWrapper: { flexDirection: "row", alignItems: "center", padding: 10, gap: 6 },
  thinkingText: { fontSize: 13, color: "#888", fontStyle: "italic" },
  dotsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#888" },
  inputRow: { flexDirection: "row", padding: 10, backgroundColor: "#fff" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
