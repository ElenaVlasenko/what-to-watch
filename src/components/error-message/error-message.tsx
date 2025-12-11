import { JSX } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { selectErrorMessage } from '../../store/error-slice';
import './error-message.css';

function ErrorMessage(): JSX.Element | null {
  const message = useAppSelector(selectErrorMessage);

  return (message)
    ? <div className='error-message'>{message}</div>
    : null;

}

export default ErrorMessage;
