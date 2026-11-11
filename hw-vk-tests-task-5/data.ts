// Все данные фиксированы; каждый тест получает отдельное состояние API.
const genres = ['Drama', 'Comedy', 'Action'] as const;

export const films = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Test Movie ${index + 1}`,
  genre: genres[index % genres.length],
  previewImage: '/img/aviator.jpg',
  previewVideoLink: '/hw5-preview.mp4',
  posterImage: '/img/aviator.jpg',
  backgroundImage: '/img/aviator.jpg',
  videoLink: '/hw5-movie.mp4',
  released: 2020 + index % 4,
  isFavorite: false,
  backgroundColor: '#eeeeee',
  description: `An unforgettable story about movie ${index + 1}.`,
  rating: 8.5,
  scoresCount: 120,
  director: 'Test Director',
  starring: ['Alice Actor', 'Bob Actor'],
  runTime: 5400,
}));

export const promo = films[0];
export const initialFavorite = films[1];
export const user = {
  email: 'student@example.com',
  name: 'Student',
  token: 'hw5-test-token',
  avatarUrl: '/img/avatar.jpg',
};

export const comments = [{
  id: 'review-1',
  date: '2026-01-15T12:00:00.000Z',
  user: 'Anna Reviewer',
  comment: 'A wonderful film with memorable characters and a compelling story.',
  rating: 9,
}];
