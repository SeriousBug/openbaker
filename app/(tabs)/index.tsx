import { Card, YStack, Text, H2, Button } from "tamagui";
import { useStarters } from "../../lib/data/starters";
import type { Starter } from "../../lib/data/starter";
import { Link } from "expo-router";
import { useMemo } from "react";
import { RRule } from "rrule";

function Starter({ starter }: { starter: Starter }) {
  const lastFed = useMemo(() => {
    if (!starter.lastFed) return undefined;
    return new Date(starter.lastFed).toLocaleString();
  }, [starter.lastFed]);

  const nextFeeding = useMemo(() => {
    if (!starter.schedule) return undefined;
    const rrule = RRule.fromString(starter.schedule);
    const next = rrule.after(
      starter.lastFed ? new Date(starter.lastFed) : new Date(),
    );
    if (!next) return undefined;
    return next.toLocaleString();
  }, [starter.schedule, starter.lastFed]);

  return (
    <Link href={`/starter/${starter.id}/view`} asChild>
      <Card elevate size="$2" p="$4" bordered>
        <Card.Header>
          <H2>{starter.name}</H2>
        </Card.Header>
        <Text>{lastFed ? `Last fed ${lastFed}` : "Never fed"}</Text>
        <Text>{nextFeeding ? `Next feeding ${nextFeeding}` : null}</Text>
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
