/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse, TErrorSources } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Use a regular expression to find the value inside the quotes
  const match = err.message.match(/"([^"]*)"/);

  // Check if a match was found and extract the value

  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid id',
    errorSources,
  };
};

export default handleDuplicateError;
