import { Link, useNavigate } from 'react-router-dom';
import { FilmListItem } from '../../types';
import { AppRoute } from '../../const';
import { JSX, useRef, useState } from 'react';

export type Props = Pick<FilmListItem, 'name' | 'previewImage' | 'id' | 'previewVideoLink'> & {
  onCardMouseEnter: (id: string) => void;
  onCardMouseLeave: () => void;
};

function FilmItemOfAList({ name, previewImage, id, onCardMouseEnter, onCardMouseLeave, previewVideoLink }: Props): JSX.Element {

  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const timerRef = useRef<null | number>(null);

  function handleClick() {
    navigate(`${AppRoute.Films}${id}`);
  }

  function handleMouseEnter() {
    timerRef.current = setTimeout(() => {
      onCardMouseEnter(id);
      setShowVideo(true);
    }, 1000) as unknown as number;
  }

  function handleMouseLeave() {
    onCardMouseLeave();
    setShowVideo(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function getImg(): JSX.Element {
    return (
      <div className="small-film-card__image">
        <img
          src={previewImage}
          alt={name}
          width={280}
          height={175}
        />
      </div>
    );
  }

  function getVideo(): JSX.Element {
    return (
      <video className="player__video" muted loop autoPlay>
        <source src={previewVideoLink} type="video/mp4" />
      </video>
    );
  }

  return (
    <article
      onClick={handleClick}
      className="small-film-card catalog__films-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showVideo ? getVideo() : getImg()}
      <h3 className="small-film-card__title">
        <Link onClick={handleClick} className="small-film-card__link" to="">
          {name}
        </Link>
      </h3>
    </article>
  );
}

export default FilmItemOfAList;
