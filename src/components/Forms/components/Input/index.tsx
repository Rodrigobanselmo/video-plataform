import { forwardRef, ForwardRefRenderFunction } from 'react';
import { IInputProps } from './@interfaces';
import {
  FormControl,
  InputContainer,
  InputElement,
  InputRight,
  FormLabel,
  FormErrorMessage,
} from './styles';

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  { name, label, error = null, pr = 0, children, ...rest },
  ref,
): JSX.Element => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <InputContainer>
        <InputElement
          style={{ paddingRight: `calc(${pr} + 1rem)` }}
          name={name}
          ref={ref}
          id={name}
          {...rest}
        />
        <InputRight>{children}</InputRight>
      </InputContainer>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputNew = forwardRef(InputBase);
