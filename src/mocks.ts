import { faker } from '@faker-js/faker';
import { Comment } from './types';
const { string, number, person, lorem, date } = faker;

export const makeFakeComment = (): Comment => ({
  id: string.uuid(),
  date: date.recent().toString(),
  user: person.firstName(),
  comment: lorem.text(),
  rating: number.int(),
});
