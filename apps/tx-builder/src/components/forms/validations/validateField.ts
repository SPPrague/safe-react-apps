import { Validate, ValidateResult } from 'react-hook-form';

import {
  ADDRESS_FIELD_TYPE,
  AMOUNT_FIELD_TYPE,
  BOOLEAN_FIELD_TYPE,
  HEX_ENCODED_DATA_FIELD_TYPE,
  U_INT_FIELD_TYPE,
} from '../fields/fields';
import basicSolidityValidation from './basicSolidityValidation';
import validateAddressField from './validateAddressField';
import validateAmountField from './validateAmountField';
import validateBooleanField from './validateBooleanField';
import validateHexEncodedDataField from './validateHexEncodedDataField';

const uintBasicValidation = (value: string) => basicSolidityValidation(value, U_INT_FIELD_TYPE);

const CUSTOM_VALIDATIONS: CustomValidationsType = {
  [ADDRESS_FIELD_TYPE]: [validateAddressField],
  [HEX_ENCODED_DATA_FIELD_TYPE]: [validateHexEncodedDataField],
  [BOOLEAN_FIELD_TYPE]: [validateBooleanField],
  [AMOUNT_FIELD_TYPE]: [validateAmountField, uintBasicValidation],
};

function validateField(fieldType: string): Validate<string> {
  return (value: string): ValidateResult =>
    [...(CUSTOM_VALIDATIONS?.[fieldType] || []), basicSolidityValidation].reduce<ValidateResult>(
      (error, validation) => {
        return error || validation(value, fieldType);
      },
      undefined, // initially no error is present
    );
}

export default validateField;

type ValidationFunction = (value: string, fieldType: string) => ValidateResult;

interface CustomValidationsType {
  [key: string]: ValidationFunction[];
}