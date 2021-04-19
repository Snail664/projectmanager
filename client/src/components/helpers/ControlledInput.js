import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";

const ControlledInput = (props) => {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (props.submitClicked) {
      setTouched(true);
    }
  }, [props.submitClicked]);

  return (
    <FormControl mb="20px" isInvalid={props.error && touched ? true : false}>
      <FormLabel>{props.label}</FormLabel>
      {!props.textarea && (
        <Input
          onBlur={(e) => {
            setTouched(true);
          }}
          type={props.type}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
          value={props.value}
        />
      )}
      {props.textarea && (
        <Textarea
          onBlur={(e) => {
            setTouched(true);
          }}
          onChange={(e) => {
            props.setValue(e.target.value);
          }}
          value={props.value}
        />
      )}
      {props.error && touched ? (
        <FormErrorMessage>{props.error}</FormErrorMessage>
      ) : (
        <FormHelperText>{props.formHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default ControlledInput;
