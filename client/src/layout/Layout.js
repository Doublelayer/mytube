import React from 'react';
import './Layout.scss';
import { HeaderNav } from '../utils/Exporter';

export function AppLayout(props) {
  return (
    <div className="app-layout">
      <HeaderNav />
      {props.children}
    </div>
  );
}
