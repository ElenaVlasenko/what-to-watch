import { BASE_URL } from '../const';

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN'
}

export const AppRoute = {
  Main: `${BASE_URL}/`,
  Login: `${BASE_URL}/login`,
  MyList: `${BASE_URL}/mylist`,
  Films: `${BASE_URL}/films/`,
  Id: ':id',
  FilmReview: '/review',
  Player: `${BASE_URL}/player/`
} as const;

export enum ServerRoute {
  Films = '/films',
  Promo = '/promo',
  LogIn = '/login',
  Logout = '/logout',
  Similar = '/similar',
  Comments = '/comments',
  Favorites = '/favorite'
}

export const PageRoute = {
  Main: AppRoute.Main,
  Login:  AppRoute.Login,
  MyList:  AppRoute.MyList,
  Film:  `${AppRoute.Films}${AppRoute.Id}`,
  FilmComment:  `${AppRoute.Films}${AppRoute.Id}${AppRoute.FilmReview}`,
  Player:  `${AppRoute.Player}${AppRoute.Id}`
} as const;

export enum FilmTab {
  OverView = 'OverView',
  Details = 'Details',
  Comments = 'Comments'
}

export const ALL_GENRES = 'All genres';

export const DISPLAYED_FILMS_NUMBER_STEP = 8;

export const DEFAULT_SIMILAR_COUNT = 4;

export const MILLISECONDS_IN_SECOND = 1000;

export const REVIEW_LENGTH = {
  MIN: 50,
  MAX: 400
};

export const GENRES_NUMBER = 9;
