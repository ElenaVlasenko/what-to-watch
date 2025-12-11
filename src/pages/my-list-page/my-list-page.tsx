import { JSX } from 'react';
import FilmList from '../../components/film-list/film-list';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import { useAppSelector } from '../../hooks/hooks';
import { selectMyFilms } from '../../store/user-slice';

function MyListPage(): JSX.Element {

  const myList = useAppSelector(selectMyFilms);

  return (
    <div className="user-page">
      <Header className='user-page__head'>{
        <h1 className="page-title user-page__title">
        My list <span className="user-page__film-count">{myList.length}</span>
        </h1>
      }
      </Header>
      <section className="catalog">
        <h2 className="catalog__title visually-hidden">Catalog</h2>
        <FilmList films={myList}/>
      </section>
      <Footer />
    </div>
  );
}

export default MyListPage;
