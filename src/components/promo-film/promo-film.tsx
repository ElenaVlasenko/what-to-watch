import { JSX } from 'react';
import { PromoFilm as TPromoFilm } from '../../types';
import FilmCardButtons from '../film-card-buttons/film-card-buttons';

type Props = {
  promoFilm: TPromoFilm;
};

function PromoFilm({ promoFilm }: Props): JSX.Element {
  return (
    <div className="film-card__info">
      <div className="film-card__poster">
        <img
          src={promoFilm.posterImage}
          alt={promoFilm.name}
          width={218}
          height={327}
        />
      </div>
      <div className="film-card__desc">
        <h2 className="film-card__title">{promoFilm.name}</h2>
        <p className="film-card__meta">
          <span className="film-card__genre">{promoFilm.genre}</span>
          <span className="film-card__year">{promoFilm.released}</span>
        </p>
        <div className="film-card__buttons">
          <FilmCardButtons id={promoFilm.id} videoLink={promoFilm.videoLink} filmName={promoFilm.name} />
        </div>
      </div>
    </div>
  );
}

export default PromoFilm;
