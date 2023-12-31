import { StyleSheet } from "react-native";

import { Switch, Button } from "tamagui";

import { Text, View } from "../../components/Themed";
import { migrateDown, migrateUp } from "../../lib/db/migration";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Button
        fontFamily="SpaceMono"
        size={4}
        onPress={() => {
          migrateUp();
        }}
      >
        Migrate To Latest
      </Button>
      <Button
        fontFamily="SpaceMono"
        size={4}
        onPress={() => {
          migrateDown();
        }}
      >
        Migrate Down
      </Button>

      <Switch size={4}>
        <Switch.Thumb animation="medium" />
      </Switch>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
