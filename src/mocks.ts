import { name, date, lorem, datatype} from 'faker';
import { Comment } from './types';

export const makeFakeComment = (): Comment => ({
  id: datatype.uuid(),
  date: date.recent().toString(),
  user: name.title(),
  comment: lorem.text(),
  rating: datatype.number(),
});
