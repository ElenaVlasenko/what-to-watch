import { useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { setVideoLink } from '../../store/player-slice';
import { fetchIsFavoritesAction, selectAddingToFavoritesOfferIds, selectAuthorizationStatus, selectMyFilms } from '../../store/user-slice';
import { JSX } from 'react';

type Props = {
  id: string;
  videoLink: string;
  filmName: string;
};

function FilmCardButtons({ id, videoLink, filmName }: Props): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const myFilmsNumber = useAppSelector(selectMyFilms);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favoriteAddingOfferIds = useAppSelector(selectAddingToFavoritesOfferIds);
  const myFilms = useAppSelector(selectMyFilms);
  const isFavorite = myFilms.some((film) => film.id === id);

  function handleClickPlayer() {
    dispatch(setVideoLink({ videoLink, filmName }));
    navigate(`${AppRoute.Player}${id}`);
  }

  const handleClickMyList: React.MouseEventHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    if(authorizationStatus === AuthorizationStatus.Auth) {
      dispatch(fetchIsFavoritesAction({ id, isFavorite: !isFavorite }));
    } else {
      navigate(AppRoute.Login);
    }
  };

  return (
    <>
      <button onClick={handleClickPlayer} className="btn btn--play film-card__button" type="button">
        <svg viewBox="0 0 19 19" width={19} height={19}>
          <use xlinkHref="#play-s" />
        </svg>
        <span>Play</span>
      </button>
      <button onClick={handleClickMyList} className="btn btn--list film-card__button" type="button" disabled={favoriteAddingOfferIds.includes(id)}>
        <svg viewBox="0 0 19 20" width={19} height={20}>
          <use xlinkHref={isFavorite ? '#in-list' : '#add'} />
        </svg>
        <span>My list</span>
        <span className="film-card__count">{myFilmsNumber.length}</span>
      </button>
    </>
  );
}

export default FilmCardButtons;
