import { JSX } from 'react';
import { Film } from '../../types';
import { getRatingName } from '../../utils';

type Props = {
  selectedFilm: Film;
};

function FilmOverview({ selectedFilm }:Props): JSX.Element {
  const { rating, description, director, scoresCount, starring } = selectedFilm;
  return (
    <>
      <div className="film-rating">
        <div className="film-rating__score">{rating}</div>
        <p className="film-rating__meta">
          <span className="film-rating__level">{getRatingName(rating)}</span>
          <span className="film-rating__count">{scoresCount} ratings</span>
        </p>
      </div>
      <div className="film-card__text">
        <p>{description}</p>
        <p className="film-card__director">
          <strong>Director: {director}</strong>
        </p>
        <p className="film-card__starring">
          <strong>
            Starring: {starring.join(', ')}
          </strong>
        </p>
      </div>
    </>
  );
}

export default FilmOverview;
