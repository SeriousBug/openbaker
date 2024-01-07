import { Link, Stack } from "expo-router";
import { Text, Heading, YStack } from "tamagui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <YStack>
        <Heading>Nothing here</Heading>
        <Text>Nothing is here, sorry. Something must be broken.</Text>
        <Link href="/">Tap here to go to the home screen</Link>
      </YStack>
    </>
  );
}
