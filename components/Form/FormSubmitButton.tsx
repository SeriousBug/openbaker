import { useFormikContext } from "formik";
import { Button, ButtonProps } from "tamagui";

export function FormSubmitButton(props: ButtonProps) {
  const { handleSubmit } = useFormikContext();

  return (
    <Button
      onPress={() => {
        handleSubmit();
      }}
      {...props}
    />
  );
}
