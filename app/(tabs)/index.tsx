import { Card, YStack, Text, H2 } from "tamagui";
import { useStarters, type Starter } from "../../lib/data/starters";

function Starter({ starter }: { starter: Starter }) {
  return (
    <Card elevate size={4} bordered>
      <Card.Header>
        <H2>{starter.name}</H2>
      </Card.Header>
      <Card.Footer />
    </Card>
  );
}

export default function TabOneScreen() {
  const { starters, addStarter, error, revalidate, mutate } = useStarters();

  console.log("starters", starters, error);

  return (
    <YStack space>
      {(starters ?? []).map((starter) => (
        <Starter key={starter.id} starter={starter} />
      ))}
    </YStack>
  );
}
