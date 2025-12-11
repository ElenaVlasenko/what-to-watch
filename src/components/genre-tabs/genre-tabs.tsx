import { JSX, MouseEventHandler } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { resetDisplayedFilmsNumber, selectSelectedGenre, setSelectedGenre } from '../../store/films-slice';
import GenreTabsItem from './genre-tabs-item';

type Props = {
  genres: string[];
};

function GenreTabs({ genres }: Props): JSX.Element {

  const dispatch = useAppDispatch();

  const handleOnClick: MouseEventHandler<HTMLUListElement> = (evt) => {
    evt.preventDefault();
    if (evt.target instanceof HTMLAnchorElement) {
      const newSelectedGenre = evt.target.innerHTML;
      dispatch(setSelectedGenre(newSelectedGenre));
      dispatch(resetDisplayedFilmsNumber());
    }
  };

  const selectedGenre = useAppSelector(selectSelectedGenre);

  return (
    <ul onClick={handleOnClick} className="catalog__genres-list">{genres.map((genre) => <GenreTabsItem key={genre} genre={genre} selectedGenre={selectedGenre} />)}</ul>
  );
}

export default GenreTabs;
