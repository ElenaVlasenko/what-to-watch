import { makeFakeComment } from '../mocks';
import { CommentsState, selectComments } from './comments-slice';

describe('Comments slice selectors', () => {
  const mockFakeComment = makeFakeComment();
  const state: CommentsState = {
    comments: [mockFakeComment],
    isCommentAddingInProgress: false,
    isCommentWasAdded: false
  };

  it('should return array of comments from state', () => {
    const { comments } = state;
    const result = selectComments({ comments: state });
    expect(result).toEqual(comments);
  });
});
