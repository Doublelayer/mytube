import React from 'react';
import './VideoInfoBox.scss';
import { Image, Button } from 'semantic-ui-react';

export class VideoInfoBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  render() {
    let descriptionTextClass = 'collapsed';
    let buttonTitle = 'Mehr Ansehen';
    if (!this.state.collapsed) {
      descriptionTextClass = 'expanded';
      buttonTitle = 'Weniger Anzeigen';
    }
    return (
      <div className="video-info-box">
        <Image className="channel-image" src="http://via.placeholder.com/48x48" circular />
        <div className="video-info">
          <div className="channel-name">Parent Name</div>
          <div className="video-publication-date">Thu 24, 2017</div>
        </div>
        <Button color="youtube">Als Favorite markieren</Button>
        <div className="video-description">
          <div className={descriptionTextClass}>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
            <p>Paragraph</p>
          </div>
          <Button compact onClick={this.onToggleCollapseButtonClick}>
            {buttonTitle}
          </Button>
        </div>
      </div>
    );
  }
  onToggleCollapseButtonClick = () => {
    this.setState(prevState => {
      return {
        collapsed: !prevState.collapsed
      };
    });
  };
}
