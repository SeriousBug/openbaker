import { Card, YStack, Text, H2 } from "tamagui";
import { useStarters, type Starter } from "../../lib/data/starters";

function Starter({ starter }: { starter: Starter }) {
  return (
    <Card elevate size="$2" p="$4" bordered>
      <Card.Header>
        <H2>{starter.name}</H2>
      </Card.Header>
      <Text>
        {starter.lastFed ? `Last fed ${starter.lastFed}` : "Never fed"}
      </Text>
      <Text>
        {starter.schedule
          ? `Next feeding ${starter.schedule}`
          : "Unknown feeding schedule"}
      </Text>
    </Card>
  );
}

export default function TabOneScreen() {
  const { starters, addStarter, error, revalidate, mutate } = useStarters();

  return (
    <YStack space m="$5">
      {(starters ?? []).map((starter) => (
        <Starter key={starter.id} starter={starter} />
      ))}
    </YStack>
  );
}
