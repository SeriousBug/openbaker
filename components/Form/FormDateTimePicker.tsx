import { useFormikContext } from "formik";
import { Button, ButtonProps } from "tamagui";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useMemo, useState } from "react";
import _ from "radash";

export function FormDateTimePicker({
  name,
  placeholder,
  ...props
}: {
  name: string;
  placeholder?: string;
} & ButtonProps) {
  const { handleChange, handleBlur, values } =
    useFormikContext<Record<string, string>>();
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = useMemo(() => {
    if (_.isEmpty(values[name])) {
      return placeholder;
    }
    const date = new Date(values[name]!);
    return date.toLocaleString();
  }, [placeholder, values[name]]);

  return (
    <>
      <Button
        {...props}
        onPress={(event) => {
          props.onPress?.(event);
          setIsOpen(true);
        }}
      >
        {formattedDate}
      </Button>
      <DateTimePickerModal
        isVisible={isOpen}
        mode="datetime"
        onConfirm={(date) => {
          handleChange(name)(date.toString());
          setIsOpen(false);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}
