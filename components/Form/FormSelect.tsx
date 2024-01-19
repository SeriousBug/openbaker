import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { Adapt, Select, Sheet, YStack } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export function FormSelect({
  name,
  values,
}: {
  name: string;
  values: string[];
}) {
  const { handleChange, values: formValues } =
    useFormikContext<Record<string, string>>();

  return (
    <Select
      disablePreventBodyScroll
      onValueChange={handleChange(name)}
      defaultValue={formValues[name]}
    >
      <Select.Trigger iconAfter={ChevronDown} flexGrow={1} flexShrink={1}>
        <Select.Value />
      </Select.Trigger>

      <Adapt platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: "spring",
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="slow"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          {/* for longer lists memoizing these is useful */}
          {useMemo(
            () =>
              values.map((name, i) => {
                return (
                  <Select.Item p="$6" index={i} key={name} value={name}>
                    <Select.ItemText>{name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              }),
            [values],
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
