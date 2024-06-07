import { PayloadAction, asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';
import { FilmsApi } from '../api/films-api';
import { showErrorMessage } from './error-slice';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type PlayerState = {
  videoLink: string;
  filmName: string;
}

const initialState: PlayerState = {
  videoLink: '',
  filmName: ''
};

export const PLAYER_SLICE_NAME = 'player';

const playerSlice = createSliceWithThunks({
  name: PLAYER_SLICE_NAME,
  initialState,
  selectors: {
    selectVideoLink: (state) => state.videoLink,
    selectFilmName: (state) => state.filmName,
  },
  reducers: (create) => ({
    setVideoLink: create.reducer((state, action: PayloadAction<{ videoLink: string; filmName: string }>) => {
      const { payload } = action;
      state.videoLink = payload.videoLink;
      state.filmName = payload.filmName;
    }),
    fetchVideoLinkAction: create.asyncThunk<{ videoLink: string; filmName: string }, string, { extra: { filmsApi: FilmsApi }}>(
      async (id, { extra: { filmsApi }, dispatch }) => {
        const film = await filmsApi.getFilm(id).catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        });
        return {
          videoLink: film.videoLink,
          filmName: film.name
        };
      },
      {
        fulfilled: (state, action) => {
          const { payload } = action;
          state.videoLink = payload.videoLink;
          state.filmName = payload.filmName;
        },
      }
    )
  }),
});

export default playerSlice;

export const {
  setVideoLink,
  fetchVideoLinkAction
} = playerSlice.actions;

export const {
  selectVideoLink,
  selectFilmName
} = playerSlice.selectors;
