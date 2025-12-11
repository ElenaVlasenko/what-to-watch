import cn from 'classnames';
import { JSX } from 'react';

type Props = {
  genre: string;
  selectedGenre: string;
};

function GenreTabsItem({ genre, selectedGenre }: Props): JSX.Element {
  return (
    <li className={cn('catalog__genres-item', { 'catalog__genres-item--active': genre === selectedGenre })}>
      <a href="#" className="catalog__genres-link">{genre}</a>
    </li>
  );
}

export default GenreTabsItem;
