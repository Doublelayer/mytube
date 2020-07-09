import React from 'react';
import { VideoPreview, NextUpVideo } from '../../utils/Exporter';
import './RelatedVideos.scss';

export function RelatedVideos(props) {
  const { relatedVideos } = props;
  if (!relatedVideos || !relatedVideos.length) {
    return <div className="related-videos" />;
  }

  const nextUpVideo = relatedVideos[0];
  const remainingVideos = relatedVideos.slice(1);

  const relatedVideoPreview = remainingVideos.map((video) => (
    <VideoPreview key={video._id} horizontal={true} video={video} pathname="/watch" search={`${video._id}`} />
  ));

  return (
    <div className="related-videos">
      <NextUpVideo video={nextUpVideo} />
      {relatedVideoPreview}
    </div>
  );
}
