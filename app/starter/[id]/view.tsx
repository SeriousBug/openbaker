import { useLocalSearchParams } from "expo-router";
import { useStarter } from "../../../lib/data/starter";
import { Text } from "tamagui";

export default function StarterView() {
  const id = useLocalSearchParams().id as string;
  const { starter } = useStarter({ id });

  if (!starter) return <Text>Loading...</Text>;

  return <Text>{starter.name}</Text>;
}
