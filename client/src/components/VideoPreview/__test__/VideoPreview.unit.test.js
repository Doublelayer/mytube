import React from 'react';
import { shallow } from 'enzyme';
import { VideoPreview } from '../../../utils/ComponentExporter';

describe('VideoPreview', () => {
  test('renders', () => {
    const wrapper = shallow(<VideoPreview />);
    expect(wrapper).toMatchSnapshot();
  });
});
