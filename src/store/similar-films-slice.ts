import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { FilmListItem } from '../types';
import { FilmsApi } from '../api/films-api';
import { showErrorMessage } from './error-slice';
import { isAxiosNotFoundError, isNotFoundError } from '../utils';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type SimilarFilmsState = {
  similarFilms: FilmListItem[];
  isSimilarFilmsLoading: boolean;
  notFoundSimilar: boolean;
}

const initialState: SimilarFilmsState = {
  similarFilms: [],
  isSimilarFilmsLoading: false,
  notFoundSimilar: false,
};

export const SIMILAR_FILMS_SLICE_NAME = 'similarFilms';

const similarFilmsSlice = createSliceWithThunks({
  name: SIMILAR_FILMS_SLICE_NAME,
  initialState,
  selectors: {
    selectSimilarFilms: (state) => state.similarFilms,
    selectIsSimilarFilmsLoading: (state) => state.isSimilarFilmsLoading,
    selectIsSimilarFilmsNotFound: (state) => state.notFoundSimilar,
  },
  reducers: (create) => ({
    fetchSimilarFilmsAction: create.asyncThunk<FilmListItem[], string, { extra: { filmsApi: FilmsApi }}>(
      async (id, { extra: { filmsApi }, dispatch }) => filmsApi.getSimilar(id).catch((err) => {
        if (!isAxiosNotFoundError(err)) {
          showErrorMessage(err, dispatch);
        }

        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.similarFilms = action.payload;
          state.isSimilarFilmsLoading = false;
        },
        pending: (state) => {
          state.similarFilms = [];
          state.isSimilarFilmsLoading = true;
        },
        rejected: (state, action) => {
          if (isNotFoundError(action.error)) {
            state.notFoundSimilar = true;
          }

          state.isSimilarFilmsLoading = false;
        }
      }
    ),
  }),
});

export default similarFilmsSlice;

export const {
  selectSimilarFilms,
  selectIsSimilarFilmsLoading,
  selectIsSimilarFilmsNotFound
} = similarFilmsSlice.selectors;

export const { fetchSimilarFilmsAction } = similarFilmsSlice.actions;
