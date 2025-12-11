import { Link } from 'react-router-dom';
import { PageRoute } from '../../const';
import { JSX } from 'react';

type Props = {
  className?: string;
}

function Logo({ className }: Props): JSX.Element {
  const linkClassName = className ? `logo__link ${className}` : 'logo__link';

  return (
    <div className="logo">
      <Link to={PageRoute.Main} className={linkClassName}>
        <span className="logo__letter logo__letter--1">W</span>
        <span className="logo__letter logo__letter--2">T</span>
        <span className="logo__letter logo__letter--3">W</span>
      </Link>
    </div>
  );
}

export default Logo;
