import { useParams } from 'react-router-dom';

// import { ERROR, IS_LOADING, NOT_FOUND } from '../../const';
import { useAppSelector } from '../../hooks/app-dispatch';
// import NotFoundPage from '../error-screen/error-404-screen';
// import LoadingScreen from '../loading-screen/loading-screen';
// import OfferScreen from './offer-screen';
// import { fetchOfferCardDataAction, selectComments, selectNeighbours, selectSelectedOfferCard } from '../../store/offer-card-slice';
// import { useEffect } from 'react';
import FilmPage from './film-page';
import { selectSelectedFilm } from '../../store/film-slice';

function FilmPagePicker(): JSX.Element | null{
  const { id } = useParams();
  // const dispatch = useAppDispatch();

  const selectedFilm = useAppSelector(selectSelectedFilm);
  // const neighbours = useAppSelector(selectNeighbours);
  // const comments = useAppSelector(selectComments);

  // useEffect(
  //   () => {
  //     if (id && selectedOffer === null) {
  //       dispatch(fetchOfferCardDataAction(id));
  //     }
  //   },
  //   [selectedOffer, id, dispatch]
  // );

  // if (id === undefined) {
  //   return <NotFoundPage />;
  // }

  // if (selectedOffer === IS_LOADING) {
  //   return <LoadingScreen />;
  // }

  // if (selectedOffer === NOT_FOUND){
  //   return <NotFoundPage />;
  // }

  // if (selectedOffer === null) {
  //   return <LoadingScreen />;
  // }

  // if (selectedOffer === ERROR) {
  //   return null;
  // }

  // return <OfferScreen selectedOffer={selectedOffer} neighbours={neighbours} comments={comments}/>;
  return <FilmPage selectedFilm={selectedFilm} />;
}

export default FilmPagePicker;
