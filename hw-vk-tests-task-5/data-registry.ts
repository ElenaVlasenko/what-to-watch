import { films } from './data';
import { Film } from './value-objects/film';

// Data Registry: единая точка доступа к тестовым сущностям по их идентификаторам.
export class DataRegistry {
  private readonly filmsById = new Map(films.map((film) => [film.id, film]));

  film(id: string): Film {
    const film = this.filmsById.get(id);
    if (!film) {
      throw new Error(`Фильм с id=${id} не зарегистрирован`);
    }
    return Film.from(film);
  }

  allFilms(): Film[] {
    return films.map((film) => Film.from(film));
  }
}

export const dataRegistry = new DataRegistry();
