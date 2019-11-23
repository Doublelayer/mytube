import React from 'react';
import { Video } from '../../../utils/ComponentExporter';
import { shallow } from 'enzyme';

test('renders video component correctly', () => {
  const wrapper = shallow(<Video url="http://www.video.com" />);
  expect(wrapper).toMatchSnapshot();
});

test('renders null if url in video component not specified', () => {
  const wrapper = shallow(<Video />);
  expect(wrapper).toMatchSnapshot();
});
