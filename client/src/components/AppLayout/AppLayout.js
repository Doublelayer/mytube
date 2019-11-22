import React from 'react';
import './AppLayout.scss';
import { HeaderNav } from '../../utils/ComponentExporter';

export function AppLayout(props) {
  return (
    <div className="app-layout">
      <HeaderNav />
      {props.children}
    </div>
  );
}
