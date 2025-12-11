import { DEFAULT_SIMILAR_COUNT, ServerRoute } from '../const';
import { Film, FilmListItem, PromoFilm } from '../types';
import api from './api';

const filmsApi = {
  async getList(): Promise<FilmListItem[]> {
    const { data } = await api.get<FilmListItem[]>(ServerRoute.Films);
    return data;
  },

  async getPromo(): Promise<PromoFilm> {
    const { data } = await api.get<PromoFilm>(ServerRoute.Promo);
    return data;
  },

  async getFilm(id: string): Promise<Film> {
    const { data } = await api.get<Film>(`${ServerRoute.Films}/${id}`);
    return data;
  },

  async getSimilar(id: FilmListItem['id'], limit = DEFAULT_SIMILAR_COUNT): Promise<FilmListItem[]> {
    const { data } = await api.get<FilmListItem[]>(`${ServerRoute.Films}/${id}${ServerRoute.Similar}`);
    return data.slice(0, limit);
  }
} as const;

type FilmsApi = typeof filmsApi;

export {
  filmsApi,
};

export type {
  FilmsApi,
};
