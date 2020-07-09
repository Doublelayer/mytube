import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const renderLabel = (label) => ({
  color: 'red',
  content: label.text,
  icon: 'check',
});

export function MultiSelectDropdown(props) {
  return (
    <Dropdown
      multiple
      selection
      fluid
      options={props.options}
      placeholder="Choose an option"
      renderLabel={renderLabel}
      onChange={props.handleOptionChange}
      defaultValue={props.selected}
    />
  );
}
