import React from 'react';
import './SideBarFooter.scss';

export function SideBarFooter() {
  return (
    <div className="sidebar__footer">
      <div className="footer-block">
        <div>About Press Copyright</div>
        <div>Creators Advertise</div>
        <div>Developers +MyTube</div>
        <div>Legal</div>
      </div>
      <div className="footer-block">
        <div>Terms Privacy</div>
        <div>Policy & Safety</div>
        <div>Test new features</div>
      </div>
      <div className="footer-block">
        <div>© Doublelayer</div>
      </div>
    </div>
  );
}
