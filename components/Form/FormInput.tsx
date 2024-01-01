import { useFormikContext } from "formik";
import { Input, InputProps, View, Label } from "tamagui";

export function FormInput({
  name,
  label,
  ...props
}: InputProps & { name: string; label?: string }) {
  const { handleChange, handleBlur, values } = useFormikContext();

  return (
    <View>
      {label ? <Label htmlFor={name}>{label}</Label> : null}
      <Input
        id={name}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        // @ts-ignore
        value={values[name]}
        {...props}
      />
    </View>
  );
}
