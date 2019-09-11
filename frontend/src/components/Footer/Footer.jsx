import React, { useEffect, useRef } from 'react';
import useWindowSize from '../../hooks/useWindowSize';
import classNames from 'classnames';
import style from './Footer.module.scss';
import BuyMeACoffeeSVG from '../../vendor/BuyMeACoffee-logo.svg';
import PayPalSVG from '../../vendor/PayPal-logo.svg';
import ZenOSmosisSVG from '../../vendor/zenOSmosis-logo.svg';

const Footer = (props) => {
  const { children, className, ...propsRest } = props;

  const footerRef = useRef(null);

  // Force re-render when window changes size
  useWindowSize();

  const _handleResize = (footerRef) => {
    const footerOffsetHeight = footerRef.current.offsetHeight;

    const bodyOffsetHeight = document.body.offsetHeight;
    const winInnerHeight = window.innerHeight;

    if (bodyOffsetHeight > winInnerHeight + footerOffsetHeight) {
      document.body.style.paddingBottom = footerOffsetHeight + 'px';
    }
  };

  if (footerRef && footerRef.current) {
    _handleResize(footerRef);
  } 

  useEffect(() => {
    _handleResize(footerRef);
  }, [footerRef]);

  return (
    <footer
      {...propsRest}
      ref={footerRef}
      className={classNames(style['footer'], className)}
      onClick={evt => evt.stopPropagation()}
      onTouchStart={evt => evt.stopPropagation()}
    >
      {
        children
      }

      {
        children &&
        <hr />
      }

      <div className={style['sponsor']}>
        <span className={style['sponsor-me-text']}>Sponsor me:</span>
        <a
          href="https://www.buymeacoffee.com/Kg8VCULYI"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="BuyMeACoffee" src={BuyMeACoffeeSVG} />
        </a>
        <span> | </span>
        <a
          href="https://paypal.me/zenOSmosis"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img alt="PayPal" src={PayPalSVG} />
        </a>

        <div className={style['zenOSmosis']}>
          <a
            href="https://zenosmosis.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img alt="zenOSmosis" src={ZenOSmosisSVG} />
          </a>
        </div>
      </div>
  </footer>
  );
};

export default Footer;