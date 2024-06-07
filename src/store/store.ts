import { configureStore } from '@reduxjs/toolkit';
import filmsSlice, { FILMS_SLICE_NAME } from './films-slice';
import filmSlice, { FILM_SLICE_NAME } from './film-slice';
import playerSlice, { PLAYER_SLICE_NAME } from './player-slice';
import commentsSlice, { COMMENTS_SLICE_NAME } from './comments-slice';
import userSlice, { USER_SLICE_NAME } from './user-slice';
import { filmsApi } from '../api/films-api';
import { userApi } from '../api/user-api';
import errorSlice, { ERROR_SLICE_NAME } from './error-slice';
import similarFilmsSlice, { SIMILAR_FILMS_SLICE_NAME } from './similar-films-slice';
import { commentsApi } from '../api/comments-api';
import { myListApi } from '../api/my-list-api';

const store = configureStore({
  reducer: {
    [FILMS_SLICE_NAME]: filmsSlice.reducer,
    [FILM_SLICE_NAME]: filmSlice.reducer,
    [PLAYER_SLICE_NAME]: playerSlice.reducer,
    [COMMENTS_SLICE_NAME]: commentsSlice.reducer,
    [USER_SLICE_NAME]: userSlice.reducer,
    [ERROR_SLICE_NAME]: errorSlice.reducer,
    [SIMILAR_FILMS_SLICE_NAME]: similarFilmsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          filmsApi,
          userApi,
          commentsApi,
          myListApi
        },
      },
    }),
});

export default store;
