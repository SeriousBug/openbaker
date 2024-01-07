import { useLocalSearchParams } from "expo-router";
import { useDeleteStarter, useStarter } from "../../../lib/data/starter";
import {
  AlertDialog,
  Button,
  ButtonProps,
  Text,
  Heading,
  XStack,
  YStack,
} from "tamagui";
import { useCallback } from "react";

export default function StarterView() {
  const id = useLocalSearchParams().id as string;
  const { starter } = useStarter({ id });
  const deleteStarter = useDeleteStarter();

  const onDelete = useCallback(() => {
    deleteStarter(id);
  }, [deleteStarter]);

  if (!starter) return <Text>Loading...</Text>;

  return (
    <YStack space p="$4">
      <Heading>{starter.name}</Heading>
      <YStack space alignItems="center">
        <Button maxWidth="$12">Feed</Button>
        <DeleteButton maxWidth="$12" onDelete={onDelete} />
      </YStack>
    </YStack>
  );
}

function DeleteButton({
  onDelete,
  ...props
}: { onDelete: () => void } & ButtonProps) {
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <Button {...props}>Dump</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="medium"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <AlertDialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "medium",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          scale={1}
          opacity={1}
          y={0}
        >
          <YStack space>
            <AlertDialog.Title>Remove Starter</AlertDialog.Title>
            <AlertDialog.Description>
              The starter will be permanently deleted. This can't be reversed.
              Are you sure?
            </AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Cancel</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button onPress={onDelete} theme="active">
                  Accept
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
