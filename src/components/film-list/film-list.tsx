import { JSX, useCallback, useState } from 'react';
import FilmItemOfAList, { Props as FilmCardProps } from './film-item-of-a-list';

type Props = {
  films: (Omit<FilmCardProps, 'onCardMouseEnter' | 'onCardMouseLeave'> & { id: string })[];
}

function FilmList({ films }: Props): JSX.Element {
  const [, setActiveFilmId] = useState<undefined | string>(undefined);
  const handleFilmMouseLeave = useCallback(() => setActiveFilmId(undefined),[]);

  return (
    <div className="catalog__films-list">
      {films.map(({ id, name, previewImage, previewVideoLink }) => <FilmItemOfAList key={id} name={name} previewImage={previewImage} id={id} previewVideoLink={previewVideoLink} onCardMouseEnter={setActiveFilmId} onCardMouseLeave={handleFilmMouseLeave}/>)}
    </div>
  );
}

export default FilmList;
