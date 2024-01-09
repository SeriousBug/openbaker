import { useCallback } from "react";
import { AlertDialog, Button, ButtonProps, XStack, YStack } from "tamagui";

export function ConfirmDialogButton({
  onConfirm,
  triggerLabel,
  title,
  description,
  cancelLabel = "Cancel",
  acceptLabel = "Accept",
  ...props
}: {
  onConfirm: () => void;
  title: string;
  description: string;
  triggerLabel: string;
  cancelLabel?: string;
  acceptLabel?: string;
} & ButtonProps) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>
        <Button {...props}>{triggerLabel}</Button>
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
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>{description}</AlertDialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>{cancelLabel}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button
                  onPress={useCallback(() => {
                    onConfirm();
                  }, [onConfirm])}
                  theme="active"
                >
                  {acceptLabel}
                </Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
