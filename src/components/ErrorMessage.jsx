import {Alert} from '@mui/material'
function parseErrorCode(code) {
  if (code === 'VALIDATION_FAILED') return 'Validation failed';
  if (code === 'UNAUTHORIZED') return 'Not authorized';
  if (code === 'FORBIDDEN') return 'No permission';

  return 'Unknown error';
}

function parseError(error) {
  let title, message;

  if (typeof error === 'object' && error.response?.data) {
    title = parseErrorCode(error.response.data.code);
    message = error.response.data.message;

    if (typeof message === 'object') {
      message = message.message;
    }
  }

  return {
    title: title || 'Unknown error',
    message: message || 'Oops, something went wrong, try again later!',
  };
}

export default function ErrorMessage({ error }) {
  if (!error) return null;

  const { title, message } = parseError(error);

  return (
    <Alert data-cy="error_message" severity="error">
      {title}<br />
      <span className="font-normal">
        {message}
      </span>
    </Alert>
  );
}