import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { FilmListItem, PromoFilm } from '../types';
import { ALL_GENRES, DISPLAYED_FILMS_NUMBER_STEP, GENRES_NUMBER } from '../const';
import { uniq } from 'lodash';
import { createSelector } from 'reselect';
import { FilmsApi } from '../api/films-api';
import { showErrorMessage } from './error-slice';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type FilmsState = {
  films: FilmListItem[];
  promoFilm: PromoFilm | null;
  selectedGenre: string;
  displayedFilmsNumber: number;
  isFilmsLoading: boolean;
  isPromoFilmLoading: boolean;
}

const initialState: FilmsState = {
  films: [],
  promoFilm: null,
  selectedGenre: ALL_GENRES,
  displayedFilmsNumber: DISPLAYED_FILMS_NUMBER_STEP,
  isFilmsLoading: false,
  isPromoFilmLoading: false,
};

function getFilteredFilmsByGenre(films: FilmListItem[], genre: string): FilmListItem[] {
  return genre === ALL_GENRES ? films : films.filter((film) => genre === film.genre);
}

export const FILMS_SLICE_NAME = 'films';

const filmsSlice = createSliceWithThunks({
  name: FILMS_SLICE_NAME,
  initialState,
  selectors: {
    selectDisplayedFilms: createSelector(
      [
        (state: FilmsState) => state.films,
        (state: FilmsState) => state.selectedGenre,
        (state: FilmsState) => state.displayedFilmsNumber,
      ],
      (films, selectedGenre, displayedFilmsNumber) => getFilteredFilmsByGenre(films, selectedGenre).slice(0, displayedFilmsNumber)
    ),
    selectFilteredFilmsNumber: createSelector(
      [
        (state: FilmsState) => state.films,
        (state: FilmsState) => state.selectedGenre,
      ],
      (films, selectedGenre) => getFilteredFilmsByGenre(films, selectedGenre).length
    ),
    selectPromoFilm: (state) => state.promoFilm,
    selectDisplayedFilmsNumber: (state) => state.displayedFilmsNumber,
    selectIsFilmsLoading: (state) => state.isFilmsLoading,
    selectGenres: createSelector(
      [
        (state: FilmsState) => state.films,
      ],
      (films) => uniq(films.map((film) => film.genre)).sort().slice(0, GENRES_NUMBER)
    ),
    selectSelectedGenre: (state) => state.selectedGenre
  },
  reducers: (create) => ({
    setSelectedGenre: create.reducer<string>((state, action) => {
      const { payload: selectedGenre } = action;
      state.selectedGenre = selectedGenre;
    }),
    increaseDisplayedFilmsNumber: create.reducer((state) => {
      state.displayedFilmsNumber = Math.min(state.films.length, state.displayedFilmsNumber + DISPLAYED_FILMS_NUMBER_STEP);
    }),
    resetDisplayedFilmsNumber: create.reducer((state) => {
      state.displayedFilmsNumber = DISPLAYED_FILMS_NUMBER_STEP;
    }),
    fetchFilmsAction: create.asyncThunk<FilmListItem[], undefined, { extra: { filmsApi: FilmsApi }}>(
      async (_arg, { extra: { filmsApi }, dispatch }) => filmsApi.getList().catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          const { payload: films } = action;
          state.films = films;
          state.isFilmsLoading = false;
        },
        pending: (state) => {
          state.isFilmsLoading = true;
        },
        rejected: (state) => {
          state.isFilmsLoading = false;
        }
      }
    ),
    fetchPromoAction: create.asyncThunk<PromoFilm, undefined, { extra: { filmsApi: FilmsApi }}>(
      (_arg, { extra: { filmsApi } }) => filmsApi.getPromo().catch((err) => {
        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.promoFilm = action.payload;
          state.isPromoFilmLoading = false;
        },
        pending: (state) => {
          state.isPromoFilmLoading = true;
        },
        rejected: (state) => {
          state.isPromoFilmLoading = false;
        }
      }
    )
  }),
});

export default filmsSlice;

export const {
  selectPromoFilm,
  selectGenres,
  selectSelectedGenre,
  selectDisplayedFilms,
  selectDisplayedFilmsNumber,
  selectFilteredFilmsNumber,
  selectIsFilmsLoading,
} = filmsSlice.selectors;

export const {
  setSelectedGenre,
  increaseDisplayedFilmsNumber,
  resetDisplayedFilmsNumber,
  fetchFilmsAction,
  fetchPromoAction
} = filmsSlice.actions;
