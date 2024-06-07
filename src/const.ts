export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN'
}

export enum AppRoute {
  Main = '/',
  Login = '/login',
  MyList = '/mylist',
  Films = '/films/',
  Id = ':id',
  FilmReview = '/review',
  Player = '/player/'
}
export enum ServerRoute {
  Films = '/films',
  Promo = '/promo',
  LogIn = '/login',
  Logout = '/logout',
  Similar = '/similar',
  Comments = '/comments',
  Favorites = '/favorite'
}

export enum PageRoute {
  Main = AppRoute.Main,
  Login = AppRoute.Login,
  MyList = AppRoute.MyList,
  Film = `${AppRoute.Films}${AppRoute.Id}`,
  FilmComment = `${AppRoute.Films}${AppRoute.Id}${AppRoute.FilmReview}`,
  Player = `${AppRoute.Player}${AppRoute.Id}`
}

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
