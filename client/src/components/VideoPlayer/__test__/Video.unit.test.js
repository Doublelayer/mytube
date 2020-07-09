import React from 'react';
import { VideoPlayer } from '../../../utils/Exporter';
import { shallow } from 'enzyme';

test('renders video component correctly', () => {
  const wrapper = shallow(<VideoPlayer url="http://www.video.com" />);
  expect(wrapper).toMatchSnapshot();
});

test('renders null if url in video component not specified', () => {
  const wrapper = shallow(<VideoPlayer />);
  expect(wrapper).toMatchSnapshot();
});
