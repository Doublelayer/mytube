import React from 'react';
import { CommentsHeader, AddComment, Comment } from '../../utils/ComponentExporter';

export class Comments extends React.Component {
  render() {
    return (
      <div>
        <CommentsHeader amountComments={this.props.amountComments} />
        <AddComment />
        <Comment />
        <Comment />
        <Comment />
      </div>
    );
  }
}
