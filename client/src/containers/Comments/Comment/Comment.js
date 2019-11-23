import React from 'react';
import './Comment.scss';
import { Image } from 'semantic-ui-react';

export function Comment(props) {
  return (
    <div className="comment">
      <Image className="user-image" src="http://via.placeholder.com/48x48" circular />
      <div>
        <div className="user-name">User name</div>
        <span>Comment text</span>
      </div>
    </div>
  );
}
