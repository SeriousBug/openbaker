import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Formik, useFormik } from "formik";
import { useCallback, useMemo } from "react";
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
import { FormInput } from "../../components/Form/FormInput";
import { FormSubmitButton } from "../../components/Form/FormSubmitButton";
import { FormSelect } from "../../components/Form/FormSelect";
import { FormDateTimePicker } from "../../components/Form/FormDateTimePicker";
import _ from "radash";
import { RRule } from "rrule";
import { z } from "zod";
import { useAddStarter } from "../../lib/data/starter";
import { router } from "expo-router";
import { Log } from "../../lib/log";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function StarterAdd() {
  const addStarter = useAddStarter();

  return (
    <KeyboardAwareScrollView>
      <Formik
        initialValues={{
          name: "",
          instructions: "",
          durationAmount: "",
          durationUnit: "",
          start: "",
        }}
        validate={(values) => {
          const errors: Partial<
            Record<keyof typeof values, string | undefined>
          > = {};
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
        onSubmit={async (values) => {
          const rrule = new RRule({
            dtstart: new Date(values.start),
            freq: RRule[values.durationUnit === "days" ? "DAILY" : "WEEKLY"],
            interval: Number.parseInt(values.durationAmount, 10),
          });
          const { id } = await addStarter({
            name: values.name,
            instructions: values.instructions,
            schedule: rrule.toString(),
            lastFed: new Date(values.start).toString(),
          });
          Log.event("starter added", { id });
          router.replace(`/starter/${id}/view`);
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
            <Button
              onPress={useCallback(() => {
                router.canGoBack() ? router.back() : router.replace("/");
              }, [])}
            >
              Cancel
            </Button>
            <FormSubmitButton>Add</FormSubmitButton>
          </XStack>
        </YStack>
      </Formik>
    </KeyboardAwareScrollView>
  );
}
