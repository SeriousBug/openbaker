import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { migrateDown, migrateUp } from "../../lib/db/migration";
import { useStarters } from "../../lib/data/starters";

export default function TabOneScreen() {
  const { starters, addStarter, error, revalidate, mutate } = useStarters();

  console.log("starters", starters, error);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>{JSON.stringify(starters)}</Text>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <Button
        title="Migrate to latest"
        onPress={() => {
          migrateUp();
        }}
      />
      <Button
        title="Migrate down"
        onPress={() => {
          migrateDown();
        }}
      />
      <Button
        title="Revalidate"
        onPress={() => {
          mutate();
        }}
      />
      <Button
        title="Add"
        onPress={() => {
          addStarter("foo");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
