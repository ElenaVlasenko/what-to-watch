import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../../const';
import Logo from '../logo/logo';
import { logoutAction, selectUser } from '../../store/user-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { JSX } from 'react';

type UserBlockProps = {
  avatarUrl: string;
}

function UserBlock({ avatarUrl }: UserBlockProps): JSX.Element {
  const navigate = useNavigate();

  function handleClick() {
    navigate(PageRoute.MyList);
  }
  return (
    <li className="user-block__item">
      <div onClick={handleClick} className="user-block__avatar">
        <img src={avatarUrl} alt="User avatar" width={63} height={63} />
      </div>
    </li>
  );
}

type Props = {
  className: string;
  children: React.ReactNode;
}

function Header({ className, children }: Props): JSX.Element {

  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleClick = user
    ? () => dispatch(logoutAction())
    : () => navigate(PageRoute.Login);

  return (
    <header className={`page-header ${className}`}>
      <Logo />
      {children}
      <ul className="user-block">
        {user ? <UserBlock avatarUrl={user.avatarUrl} /> : null}
        <li onClick={handleClick} className="user-block__item">
          <a className="user-block__link">{user ? 'Sign out' : 'Sign in'}</a>
        </li>
      </ul>
    </header>
  );
}

export default Header;
