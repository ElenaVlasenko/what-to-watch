import { Routes, Route, HashRouter } from 'react-router-dom';
import { AuthorizationStatus, PageRoute } from '../const';
import MainPage from '../pages/main-page/main-page';
import NotFoundPage from '../pages/not-found-page/not-found-page';
import FilmPagePicker from '../pages/film-page/film-page-picker';
import MyListPage from '../pages/my-list-page/my-list-page';
import LoginPage from '../pages/login-page/login-page';
import ConditionalRoute from '../components/conditional-route/conditional-route';
import { useAppSelector } from '../hooks/hooks';
import { selectAuthorizationStatus, selectIsUserDataLoading } from '../store/user-slice';
import { selectIsFilmsLoading } from '../store/films-slice';
import ErrorMessage from '../components/error-message/error-message';
import AddReviewPagePicker from '../pages/add-review-page/add-review-page-picker';
import Spinner from '../components/spinner/spinner';
import PlayerPagePicker from '../pages/player-page/player-page-picker';
import { JSX } from 'react';

function getOnLoadingRoutes() {
  return (
    <>
      {Object.values(PageRoute).map((route) => <Route key={route} path={route} element={<Spinner/>}></Route>)}
      <Route path='*' element={<NotFoundPage />} />
    </>
  );
}
function App(): JSX.Element {
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isFilmsLoading = useAppSelector(selectIsFilmsLoading);
  const isUserDataLoading = useAppSelector(selectIsUserDataLoading);
  const isLoading = isFilmsLoading || isUserDataLoading;

  function getInitializedAppRoutes() {
    return (
      <>
        <Route path={PageRoute.Main} element={<MainPage />} />
        <Route path={PageRoute.MyList} element={
          <ConditionalRoute
            condition={authorizationStatus === AuthorizationStatus.Auth}
            routOnFalse={PageRoute.Login}
          >
            <MyListPage />
          </ConditionalRoute>
        }
        />
        <Route path={PageRoute.Login} element={
          <ConditionalRoute
            condition={authorizationStatus !== AuthorizationStatus.Auth}
            routOnFalse={PageRoute.Main}
          >
            <LoginPage />
          </ConditionalRoute>
        }
        />
        <Route path={PageRoute.Film} element={<FilmPagePicker />} />
        <Route path={PageRoute.Player} element={<PlayerPagePicker />} />
        <Route path={PageRoute.FilmComment} element={
          <ConditionalRoute
            condition={authorizationStatus === AuthorizationStatus.Auth}
            routOnFalse={PageRoute.Login}
          >
            <AddReviewPagePicker />
          </ConditionalRoute>
        }
        />
        <Route path='*' element={<NotFoundPage />} />
      </>
    );
  }

  return (
    <>
      <ErrorMessage />
      <HashRouter>
        <Routes>
          {isLoading ? getOnLoadingRoutes() : getInitializedAppRoutes()}
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
