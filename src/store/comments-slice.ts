import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit';
import { Comment, UserComment } from '../types';
import { CommentsApi } from '../api/comments-api';
import { showErrorMessage } from './error-slice';
import { isAxiosNotFoundError } from '../utils';

const createSliceWithThunks = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export type CommentsState = {
  comments: Comment[];
  isCommentAddingInProgress: boolean;
  isCommentWasAdded: boolean;
}

const initialState: CommentsState = {
  comments: [],
  isCommentAddingInProgress: false,
  isCommentWasAdded: false
};

export const COMMENTS_SLICE_NAME = 'comments';

const commentsSlice = createSliceWithThunks({
  name: COMMENTS_SLICE_NAME,
  initialState,
  selectors: {
    selectComments: (state) => state.comments,
    selectIsCommentAddingInProgress: (state) => state.isCommentAddingInProgress,
  },
  reducers: (create) => ({
    fetchCommentsAction: create.asyncThunk<Comment[], string, { extra: { commentsApi: CommentsApi }}>(
      async (id, { extra: { commentsApi }, dispatch }) => commentsApi.getList(id).catch((err) => {
        if (!isAxiosNotFoundError(err)) {
          showErrorMessage(err, dispatch);
        }

        throw err;
      }),
      {
        fulfilled: (state, action) => {
          state.comments = action.payload;
        },
        pending: (state) => {
          state.comments = [];
        },
      }
    ),
    addCommentAction: create.asyncThunk<Comment, { comment: UserComment; onSuccess: () => void }, { extra: { commentsApi: CommentsApi }}>(
      ({ comment, onSuccess }, { extra: { commentsApi }, dispatch }) => commentsApi.sendComment(comment)
        .then((res) => {
          onSuccess();
          return res;
        })
        .catch((err) => {
          showErrorMessage(err, dispatch);
          throw err;
        }),
    {
      fulfilled: (state, action) => {
        state.isCommentAddingInProgress = false;
        state.comments = [action.payload, ...state.comments];
        state.isCommentWasAdded = true;
      },
      pending: (state) => {
        state.isCommentAddingInProgress = true;
      },
      rejected: (state) => {
        state.isCommentAddingInProgress = false;
      }
    }
    ),
  }),
});

export default commentsSlice;

export const {
  selectComments,
  selectIsCommentAddingInProgress
} = commentsSlice.selectors;

export const {
  fetchCommentsAction,
  addCommentAction
} = commentsSlice.actions;
