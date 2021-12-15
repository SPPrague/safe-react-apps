import { toBN } from 'web3-utils';

type InputType = {
  internalType: string;
  name: string;
  type: string;
  components: InputType[];
};

export const getInputHelper = (input: InputType) => {
  // This code renders a helper for the input text.
  if (input.type.startsWith('tuple')) {
    return `tuple(${input.components.map((c: InputType) => c.internalType).toString()})${
      input.type.endsWith('[]') ? '[]' : ''
    }`;
  } else {
    return input.type;
  }
};

// Same regex used for web3@1.3.6
export const paramTypeNumber = new RegExp(/^(u?int)([0-9]*)$/);

// This function is used to apply some parsing to some value types
export const parseInputValue = (input: any, value: string): any => {
  // If there is a match with this regular expression we get an array value like the following
  // ex: ['uint16', 'uint', '16']. If no match, null is returned
  const isNumberInput = paramTypeNumber.test(input.type);
  const isBooleanInput = input.type === 'bool';

  if (value.charAt(0) === '[') {
    return JSON.parse(value.replace(/"/g, '"'));
  }

  if (isBooleanInput) {
    return value.toLowerCase() === 'true';
  }

  if (isNumberInput && value) {
    // From web3 1.2.5 negative string numbers aren't correctly padded with leading 0's.
    // To fix that we pad the numeric values here as the encode function is expecting a string
    // more info here https://github.com/ChainSafe/web3.js/issues/3772
    const bitWidth = input.type.match(paramTypeNumber)[2];
    return toBN(value).toString(10, bitWidth);
  }

  return value;
};

export const isInputValueValid = (val: string) => {
  const value = Number(val);
  if (isNaN(value) || value < 0) {
    return false;
  }

  return true;
};

export const getCustomDataError = (value: string | undefined) => {
  return `Has to be a valid strict hex data ${!value?.startsWith('0x') ? '(it must start with 0x)' : ''}`;
};
