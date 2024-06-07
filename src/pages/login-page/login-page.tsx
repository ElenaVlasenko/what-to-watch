import { FormEvent, useState } from 'react';
import Footer from '../../components/footer/footer';
import Logo from '../../components/logo/logo';
import { loginAction } from '../../store/user-slice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useNavigate } from 'react-router-dom';
import { PageRoute } from '../../const';
import { selectErrorMessage } from '../../store/error-slice';
import ErrorPage from '../error-page/error-page';

function isPasswordValid(password: string): boolean {
  return /[A-z]+/.test(password) && /\d+/.test(password);
}
function isEmailValid(email: string): boolean {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function LoginPage(): JSX.Element {

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(selectErrorMessage);

  if (error) {
    return <ErrorPage />;
  }

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault();
    setErrorMessages('');

    if (isPasswordValid(password) && isEmailValid(login)) {
      dispatch(loginAction({ login, password }));
      navigate(PageRoute.Main);
    } else {
      const errors = [
        ...(!isPasswordValid(password) ? ['Password must includes at least one digit and one letter.'] : []),
        ...(!isEmailValid(login) ? ['Please enter a valid email address.'] : []),
      ];

      setErrorMessages(errors.join(' '));
    }
  }

  return (
    <div className="user-page">
      <header className="page-header user-page__head">
        <Logo />
        <h1 className="page-title user-page__title">Sign in</h1>
      </header>
      <div className="sign-in user-page__content">
        <form onSubmit={handleSubmit} action="#" className="sign-in__form">
          <div className="sign-in__message">
            <p>{errorMessages}</p>
          </div>
          <div className="sign-in__fields">
            <div className="sign-in__field">
              <input
                onChange={(evt) => setLogin(evt.currentTarget.value)}
                className="sign-in__input"
                type="email"
                placeholder="Email address"
                name="user-email"
                id="user-email"
              />
              <label
                className="sign-in__label visually-hidden"
                htmlFor="user-email"
              >
                Email address
              </label>
            </div>
            <div className="sign-in__field">
              <input
                onChange={(evt) => setPassword(evt.currentTarget.value)}
                className="sign-in__input"
                type="password"
                placeholder="Password"
                name="user-password"
                id="user-password"
              />
              <label
                className="sign-in__label visually-hidden"
                htmlFor="user-password"
              >
                Password
              </label>
            </div>
          </div>
          <div className="sign-in__submit">
            <button className="sign-in__btn" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
