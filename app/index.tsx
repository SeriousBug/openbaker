import { Card, YStack, Text, H2, Button, View } from "tamagui";
import { useStarters } from "../lib/data/starters";
import { Link } from "expo-router";
import { useMemo } from "react";
import { RootContainer } from "../components/RootContainer";
import { getFormattedNextFeeding } from "../lib/time";
import { Loading } from "../components/Loading";
import type { Starter } from "../lib/data/starterSchema";

function Starter({ starter }: { starter: Starter }) {
  const lastFed = useMemo(() => {
    if (!starter.lastFed) return undefined;
    return new Date(starter.lastFed).toLocaleDateString();
  }, [starter.lastFed]);

  const nextFeed = useMemo(() => {
    return getFormattedNextFeeding(starter);
  }, [starter.schedule, starter.lastFed]);

  return (
    <Link href={`/starter/${starter.id}/view`} asChild>
      <Card elevate size="$2" p="$4" bordered>
        <Card.Header>
          <H2>{starter.name}</H2>
        </Card.Header>
        <Text>{lastFed ? `Last fed ${lastFed}` : "Never fed"}</Text>
        <Text>{nextFeed ? `Next feeding ${nextFeed}` : null}</Text>
      </Card>
    </Link>
  );
}

function StarterList() {
  const { starters } = useStarters();

  if (!starters) {
    return <Loading />;
  }
  if (starters.length === 0) {
    <Text>No starters yet...</Text>;
  }

  return (
    <YStack space>
      {starters.map((starter) => (
        <Starter key={starter.id} starter={starter} />
      ))}
    </YStack>
  );
}

export function AddStarterButton() {
  const { starters } = useStarters();

  if (starters === undefined) {
    return <Loading />;
  }
  let contents: string;
  if (starters.length === 0) {
    contents = "Add your first starter";
  } else {
    contents = "Add starter";
  }

  return (
    <Link href="/starter/add" asChild>
      <Button size="$4">{contents}</Button>
    </Link>
  );
}

export default function TabOneScreen() {
  return (
    <RootContainer hasTitle space>
      <StarterList />
      <View alignItems="flex-end">
        <AddStarterButton />
      </View>
    </RootContainer>
  );
}
