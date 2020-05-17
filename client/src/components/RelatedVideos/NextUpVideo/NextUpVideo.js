import React from 'react';
import { Checkbox, Divider } from 'semantic-ui-react';
import { VideoPreview } from '../../../utils/ComponentExporter';
import './NextUpVideo.scss';

export function NextUpVideo(props) {
  return (
    <React.Fragment>
      <div className="next-up-container">
        <h4>Nächstes Video</h4>
        <div className="up-next-toggle">
          <span>Autoplay</span>
          <Checkbox toggle defaultChecked />
        </div>
      </div>
      <VideoPreview horizontal={true} pathname="/watch" search={`${props.video._id}`} video={props.video} />
      <Divider />
    </React.Fragment>
  );
}
