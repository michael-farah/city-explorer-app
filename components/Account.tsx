import { AppContext } from "@/app/AppContext";
import { useContext } from "react";
import { Button } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet } from "react-native";

export default function Account() {
  const { setUser, user } = useContext(AppContext);
  if (!user.username) {
    return;
  }
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.text} type="title">
        {user.username}
      </ThemedText>

      <Button
        title="Logout"
        onPress={() => {
          setUser({});
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
});