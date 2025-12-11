import { JSX, MouseEventHandler } from 'react';
import { FilmTab } from '../../const';
import cn from 'classnames';

type Props = {
  onTabClick: (tab: FilmTab) => void;
  selectedTab: FilmTab;
}

function FilmTabs({ onTabClick, selectedTab }:Props): JSX.Element {

  function getClassName(tab: FilmTab): string {
    return cn('film-nav__item', { 'film-nav__item--active': tab === selectedTab });
  }

  const handleClick: MouseEventHandler = (evt) => {
    evt.preventDefault();

    if (evt.target instanceof HTMLAnchorElement) {
      const newSelectedTab = evt.target.innerText as FilmTab;
      onTabClick(newSelectedTab);
    }
  };

  return (
    <nav className="film-nav film-card__nav">
      <ul className="film-nav__list" onClick={handleClick}>
        <li className={getClassName(FilmTab.OverView)}>
          <a href="#" className="film-nav__link">
            {FilmTab.OverView}
          </a>
        </li>
        <li className={getClassName(FilmTab.Details)}>
          <a href="#" className="film-nav__link">
            {FilmTab.Details}
          </a>
        </li>
        <li className={getClassName(FilmTab.Comments)}>
          <a href="#" className="film-nav__link">
            {FilmTab.Comments}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default FilmTabs;
