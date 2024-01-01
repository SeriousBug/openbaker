import { useFormikContext } from "formik";
import { Input, InputProps } from "tamagui";

export function FormInput({ name, ...props }: InputProps & { name: string }) {
  const { handleChange, handleBlur, values } = useFormikContext();

  return (
    <Input
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      // @ts-ignore
      value={values[name]}
      {...props}
    />
  );
}
