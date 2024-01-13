import { router, useLocalSearchParams } from "expo-router";
import {
  useDeleteStarter,
  useFeedStarter,
  useStarter,
} from "../../../lib/data/starter";
import { Text, Heading, YStack, View } from "tamagui";
import { useCallback, useMemo, useState } from "react";
import { Loading } from "../../../components/Loading";
import { getFormattedNextFeeding } from "../../../lib/time";
import { ConfirmDialogButton } from "../../../components/ConfirmDialogButton";

export default function StarterView() {
  const id = useLocalSearchParams().id as string;
  const { starter } = useStarter({ id });
  const deleteStarter = useDeleteStarter();
  const feedStarter = useFeedStarter();
  const [inProgress, setInProgress] = useState(false);

  const onDelete = useCallback(async () => {
    setInProgress(true);
    try {
      await deleteStarter(id);
      router.replace("/");
    } finally {
      setInProgress(false);
    }
  }, [deleteStarter]);
  const onFeed = useCallback(async () => {
    setInProgress(true);
    try {
      await feedStarter({ id, newFeeding: new Date().toISOString() });
    } finally {
      setInProgress(false);
    }
  }, [starter]);

  const nextFeed = useMemo(() => {
    return getFormattedNextFeeding(starter);
  }, [starter]);
  const lastFed = useMemo(() => {
    if (!starter?.lastFed) return undefined;
    return new Date(starter.lastFed).toLocaleDateString();
  }, [starter]);

  if (!starter) return <Loading />;

  return (
    <YStack space p="$4">
      <Heading>{starter.name}</Heading>
      <View mb="$4">
        <Text>{lastFed ? `Last fed ${lastFed}` : "Never fed"}</Text>
        <Text>{nextFeed ? `Next feeding ${nextFeed}` : null}</Text>
      </View>
      <YStack space alignItems="center">
        <ConfirmDialogButton
          disabled={inProgress}
          maxWidth="$12"
          onConfirm={onFeed}
          triggerLabel="Feed"
          title={`Feed ${starter.name}`}
          description="Feeding your starter?"
          acceptLabel="Fed!"
          cancelLabel="Not yet"
        />
        <ConfirmDialogButton
          disabled={inProgress}
          maxWidth="$12"
          onConfirm={onDelete}
          triggerLabel="Dump"
          title={`Delete ${starter.name}`}
          description="The starter will be permanently deleted. This can't be reversed. Are you sure?"
          acceptLabel="Delete"
          cancelLabel="Keep"
        />
      </YStack>
    </YStack>
  );
}
