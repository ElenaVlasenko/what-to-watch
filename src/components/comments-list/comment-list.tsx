import { JSX } from 'react';
import { Comment } from '../../types';
import CommentItemOfAList from './comment-item-of-a-list';

type Props = {
  comments: Comment[];
}

function CommentsList({ comments }: Props): JSX.Element {
  const reviewsColumnLeft = comments.slice(0, Math.ceil(comments.length / 2));
  const reviewsColumnRight = comments.slice(Math.ceil(comments.length / 2), comments.length);

  function createReviewsColumn(columnReviews: Comment[]) {
    return (
      <div className="film-card__reviews-col">
        {columnReviews.map((comment) => <CommentItemOfAList key={comment.id} comment={comment}/>)}
      </div>
    );
  }

  return (
    <div className="film-card__reviews film-card__row">
      {createReviewsColumn(reviewsColumnLeft)}
      {createReviewsColumn(reviewsColumnRight)}
    </div>
  );
}

export default CommentsList;
