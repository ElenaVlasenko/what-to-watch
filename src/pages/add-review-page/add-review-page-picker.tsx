import { useEffect } from 'react';
import Spinner from '../../components/spinner/spinner';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { fetchFilmAction, selectIsFilmLoading, selectIsFilmNotFound, selectSelectedFilm } from '../../store/film-slice';
import NotFoundPage from '../not-found-page/not-found-page';
import AddReviewPage from './add-review-page';
import { useParams } from 'react-router-dom';
import { selectErrorMessage } from '../../store/error-slice';
import { fetchSimilarFilmsAction, selectIsSimilarFilmsLoading, selectIsSimilarFilmsNotFound } from '../../store/similar-films-slice';
import { fetchCommentsAction } from '../../store/comments-slice';
import ErrorPage from '../error-page/error-page';

function AddReviewPagePicker(): JSX.Element | null{

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const selectedFilm = useAppSelector(selectSelectedFilm);
  const isSelectedFilmLoading = useAppSelector(selectIsFilmLoading);
  const isSelectedFilmNotFound = useAppSelector(selectIsFilmNotFound);
  const error = useAppSelector(selectErrorMessage);
  const isSimilarFilmsLoading = useAppSelector(selectIsSimilarFilmsLoading);
  const isSimilarNotFound = useAppSelector(selectIsSimilarFilmsNotFound);

  useEffect(
    () => {
      if (
        id
        && (selectedFilm === null || selectedFilm.id !== id)
        && isSelectedFilmLoading === false
        && isSelectedFilmNotFound !== true
        && error === null
      ) {
        dispatch(fetchFilmAction(id));
        dispatch(fetchSimilarFilmsAction(id));
        dispatch(fetchCommentsAction(id));
      }
    },
    [selectedFilm, id, isSelectedFilmLoading, isSelectedFilmNotFound, isSimilarFilmsLoading, isSimilarNotFound, dispatch, error]
  );

  if (error) {
    return <ErrorPage />;
  }

  if (selectedFilm === null) {
    return <Spinner />;
  }

  if (selectedFilm?.id === undefined || isSelectedFilmNotFound) {
    return <NotFoundPage />;
  }

  return <AddReviewPage selectedFilm={selectedFilm} />;
}

export default AddReviewPagePicker;
