import React from 'react';
import { View, Text, CheckBox } from 'react-native';
import { useField } from 'formik';

const FormikCheckboxField = ({ label, name }) => {
  const [field, meta, helpers] = useField(name);
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
      <CheckBox
        value={field.value}
        onValueChange={(newValue) => helpers.setValue(newValue)}
      />
      <Text style={{ marginLeft: 8 }}>{label}</Text>
      {meta.touched && meta.error ? (
        <Text style={{ color: 'red', marginLeft: 8 }}>{meta.error}</Text>
      ) : null}
    </View>
  );
};

export default FormikCheckboxField;