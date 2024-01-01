import { Card, YStack, Text, H2, Button } from "tamagui";
import { useStarters } from "../../lib/data/starters";
import type { Starter } from "../../lib/data/starter";
import { Link } from "expo-router";

function Starter({ starter }: { starter: Starter }) {
  return (
    <Link href={`/starter/${starter.id}/view`} asChild>
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
    </Link>
  );
}

export default function TabOneScreen() {
  const { starters } = useStarters();

  return (
    <YStack space p="$2">
      <YStack space>
        {(starters ?? []).map((starter) => (
          <Starter key={starter.id} starter={starter} />
        ))}
      </YStack>
      <Link href="/starter/add" asChild>
        <Button maxWidth="$12" size={4}>
          Add Another
        </Button>
      </Link>
    </YStack>
  );
}
