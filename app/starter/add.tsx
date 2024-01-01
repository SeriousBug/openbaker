import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Formik } from "formik";
import { useMemo } from "react";
import {
  Adapt,
  Button,
  H1,
  Input,
  Label,
  Select,
  Sheet,
  XStack,
  YStack,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { FormInput } from "../../components/Form/FormInput";
import { FormSubmitButton } from "../../components/Form/FormSubmitButton";
import { FormSelect } from "../../components/Form/FormSelect";

export default function StarterAdd() {
  return (
    <Formik
      initialValues={{ name: "", instructions: "", period: "", duration: "" }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <YStack space>
        <Label>Name</Label>
        <FormInput name="name" placeholder="My First Starter" />
        <Label>Feeding Instructions</Label>
        <FormInput
          name="instructions"
          multiline
          placeholder="Discard 30g, add 15g whole wheat flour and ..."
        />
        <Label>Feed Every</Label>
        <XStack space>
          <FormInput name="period" placeholder="2"></FormInput>
          <FormSelect name="duration" values={["days", "weeks"]} />
        </XStack>
        <XStack space>
          <Button>Cancel</Button>
          <FormSubmitButton>Add</FormSubmitButton>
        </XStack>
      </YStack>
    </Formik>
  );
}

function StarterScheduleSelect() {
  return (
    <Select disablePreventBodyScroll>
      <Select.Trigger width={220} iconAfter={ChevronDown}>
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
              [{ name: "day" }, { name: "week" }].map((item, i) => {
                return (
                  <Select.Item
                    p="$6"
                    index={i}
                    key={item.name}
                    value={item.name.toLowerCase()}
                  >
                    <Select.ItemText>{item.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              }),
            [],
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
