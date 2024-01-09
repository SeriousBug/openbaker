import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Formik } from "formik";
import { useMemo } from "react";
import {
  Adapt,
  Button,
  Text,
  Label,
  Select,
  Sheet,
  XStack,
  YStack,
  View,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { FormInput } from "../../components/Form/FormInput";
import { FormSubmitButton } from "../../components/Form/FormSubmitButton";
import { FormSelect } from "../../components/Form/FormSelect";
import { FormDateTimePicker } from "../../components/Form/FormDateTimePicker";
import _ from "radash";
import { RRule } from "rrule";
import { z } from "zod";
import { useAddStarter } from "../../lib/data/starter";

export default function StarterAdd() {
  const addStarter = useAddStarter();

  return (
    <Formik
      initialValues={{
        name: "",
        instructions: "",
        durationAmount: "",
        durationUnit: "",
        start: "",
      }}
      validate={(values) => {
        const errors: Partial<Record<keyof typeof values, string | undefined>> =
          {};
        if (_.isEmpty(values.name)) {
          errors.name = "Required";
        }

        if (_.isEmpty(values.durationAmount)) {
          errors.durationAmount = "Required";
        } else if (
          !z.coerce.number().int().safeParse(values.durationAmount).success
        ) {
          errors.durationAmount = "Must be a whole number";
        } else if (Number.parseInt(values.durationAmount, 10) < 1) {
          errors.durationAmount = "Must be 1 or greater";
        }

        if (_.isEmpty(values.durationUnit)) {
          errors.durationUnit = "Required";
        }

        if (_.isEmpty(values.start)) {
          errors.start = "Required";
        }
        return errors;
      }}
      onSubmit={(values) => {
        const rrule = new RRule({
          dtstart: new Date(values.start),
          freq: RRule[values.durationUnit === "days" ? "DAILY" : "WEEKLY"],
          interval: Number.parseInt(values.durationAmount, 10),
        });
        addStarter({
          name: values.name,
          instructions: values.instructions,
          schedule: rrule.toString(),
          lastFed: new Date(values.start).toString(),
        });
      }}
    >
      <YStack space p="$4">
        <FormInput
          label="Starter name"
          name="name"
          placeholder="My First Starter"
        />
        <FormInput
          label="Feeding instructions"
          name="instructions"
          multiline
          placeholder="Discard 30g, add 15g whole wheat flour and ..."
        />
        <View>
          <Label>Schedule Start</Label>
          <FormDateTimePicker name="start" />
          <Text>The date you fed this starter last.</Text>
        </View>
        <View>
          <Label>Feed Every</Label>
          <XStack space>
            <FormInput
              name="durationAmount"
              placeholder="2"
              inputMode="numeric"
            />
            <FormSelect name="durationUnit" values={["days", "weeks"]} />
          </XStack>
        </View>
        <XStack space justifyContent="flex-end" mt="$12">
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
