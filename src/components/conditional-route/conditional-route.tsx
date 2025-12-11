import { Navigate } from 'react-router-dom';
import { PageRoute } from '../../const';
import { JSX } from 'react';

type Props = {
  condition: boolean;
  routOnFalse: typeof PageRoute[keyof typeof PageRoute];
  children: JSX.Element;
};

function ConditionalRoute(props: Props): JSX.Element {
  const { condition, children, routOnFalse } = props;

  return condition ? children : <Navigate to={routOnFalse} replace />;
}

export default ConditionalRoute;
