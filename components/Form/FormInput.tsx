import { useFormikContext } from "formik";
import { Input, InputProps, View, Label, Text } from "tamagui";
import _ from "radash";

export function FormInput({
  name,
  label,
  ...props
}: InputProps & { name: string; label?: string }) {
  const { handleChange, handleBlur, values, errors, touched } =
    useFormikContext<Record<string, string>>();

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
      <Text>
        {!_.isEmpty(errors[name]) && touched[name] ? errors[name] : ""}
      </Text>
    </View>
  );
}
