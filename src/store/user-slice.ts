import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const';
import { AuthData, FilmListItem, User } from '../types';
import { getToken } from '../api/token';
import { UserApi } from '../api/user-api';
import { showErrorMessage } from './error-slice';
import { MyListApi } from '../api/my-list-api';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

type UserState = {
  user: User | null;
  token: string | null;
  isUserDataLoading: boolean;
  myFilms: FilmListItem[];
  addingToFavoritesOfferIds: string[];
}

const initialState: UserState = {
  user: null,
  token: getToken(),
  isUserDataLoading: false,
  myFilms: [],
  addingToFavoritesOfferIds: [],
};

export const USER_SLICE_NAME = 'user';

const userSlice = createSliceWithThunks({
  name: USER_SLICE_NAME,
  initialState,
  selectors: {
    selectUser: (state) => state.user,
    selectMyFilms: (state) => state.myFilms,
    selectIsUserDataLoading: (state) => state.isUserDataLoading,
    selectAddingToFavoritesOfferIds: (state) => state.addingToFavoritesOfferIds,
    selectAuthorizationStatus: (state) => {
      if (state.user) {
        return AuthorizationStatus.Auth;
      }

      if (state.token) {
        return AuthorizationStatus.Unknown;
      }

      return AuthorizationStatus.NoAuth;
    },
  },
  reducers: (create) => ({
    loginAction: create.asyncThunk<{ user: User; myFilms: FilmListItem[] }, AuthData , { extra: { userApi: UserApi; myListApi: MyListApi }}>(
      async (authData, { extra: { userApi, myListApi }, dispatch }) => {
        const user = await userApi.login(authData).catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        });
        const myFilms = await myListApi.getList().catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        });
        return { user, myFilms };
      },
      {
        pending: (state) => {
          state.isUserDataLoading = true;
        },
        fulfilled: (state, action) => {
          state.user = action.payload.user;
          state.myFilms = action.payload.myFilms;
          state.isUserDataLoading = false;
        },
        rejected: (state) => {
          state.isUserDataLoading = false;
        },
      }
    ),
    logoutAction: create.asyncThunk<void, undefined , { extra: { userApi: UserApi }}>(
      (_arg, { extra: { userApi }, dispatch }) => userApi.logout().catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        fulfilled: (state) => {
          state.user = null;
          state.token = null;
          state.myFilms = [];
        },
      }
    ),
    checkAuthAction: create.asyncThunk<{ user: User | null; myFilms: FilmListItem[] }, undefined, { extra: { userApi: UserApi; myListApi: MyListApi } }>(
      async (_arg, { extra: { userApi, myListApi }, getState, dispatch }) => {
        const state = getState() as { user: UserState };

        if(!state.user.token) {
          return { user: null, myFilms: [] };
        }

        const user = await userApi.getAuthorizedUser().catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        });
        const myFilms = await myListApi.getList().catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        });

        return { user, myFilms };
      },
      {
        fulfilled: (state, action) => {
          const { payload: { user, myFilms } } = action;
          state.user = user;
          state.myFilms = myFilms;
          state.isUserDataLoading = false;

        },
        pending: (state) => {
          state.isUserDataLoading = true;
        },
        rejected: (state) => {
          state.isUserDataLoading = false;
          state.token = null;
        },
      }
    ),
    fetchIsFavoritesAction: create.asyncThunk<FilmListItem & { isFavorite: boolean }, { id: string; isFavorite: boolean }, { extra: { myListApi: MyListApi } }>(
      async ({ id, isFavorite }, { extra: { myListApi }, dispatch }) => myListApi.changeIsFavorite(id, isFavorite).catch((err) => {
        showErrorMessage(err, dispatch);
        throw err;
      }),
      {
        pending: (state, action) => {
          state.addingToFavoritesOfferIds = [...state.addingToFavoritesOfferIds, action.meta.arg.id];
        },
        fulfilled: (state, action) => {
          const updatedFilm = action.payload;

          if (updatedFilm.isFavorite){
            state.myFilms = [...state.myFilms, updatedFilm];
          } else {
            state.myFilms = state.myFilms.filter((film) => film.id !== updatedFilm.id);
          }

          state.addingToFavoritesOfferIds = state.addingToFavoritesOfferIds.filter((id) => id !== action.meta.arg.id);
        },
        rejected: (state, action) => {
          state.addingToFavoritesOfferIds = state.addingToFavoritesOfferIds.filter((id) => id !== action.meta.arg.id);
        },
      }
    )
  }),
});

export default userSlice;

export const {
  selectAuthorizationStatus,
  selectUser, selectMyFilms,
  selectIsUserDataLoading,
  selectAddingToFavoritesOfferIds
} = userSlice.selectors;

export const {
  loginAction,
  logoutAction,
  checkAuthAction,
  fetchIsFavoritesAction
} = userSlice.actions;
