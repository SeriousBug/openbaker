import React from "react";
import { YStack, YStackProps } from "tamagui";

export function RootContainer({
  children,
  hasTitle,
  ...props
}: {
  children: React.ReactNode;
  hasTitle?: boolean;
} & Omit<YStackProps, "children">) {
  return (
    <YStack p="$4" pt={hasTitle ? "$8" : "$4"} {...props}>
      {children}
    </YStack>
  );
}
