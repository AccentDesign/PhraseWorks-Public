import React, { useEffect, useState } from 'react';
import { APIGetCookieConsentSettings } from '../API/APICookieConsent';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';

const Cookie = () => {
  const [visible, setVisible] = useState(false);

  const [settings, setSettings] = useState({
    title: 'We value your privacy',
    title_color: '#ffffff',
    consent_text:
      'We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking "Accept All", you consent to our use of cookies.',
    consent_text_color: '#ffffff',
    consent_location: 'bottom_right',
    accept_btn_text: 'Accept All',
    decline_btn_text: 'Reject All',
    section_color: '#8f78b0',
    accept_btn_color: '#ffffff',
    accept_btn_hover_color: '#f5eeff',
    accept_btn_text_color: '#292751',
    decline_btn_color: '#292751',
    decline_btn_hover_color: '#3f3b7aff',
    decline_btn_text_color: '#ffffff',
  });

  const fetchData = async () => {
    const data = await APIGetCookieConsentSettings();
    if (data.status == 200) {
      const tmpSettings = JSON.parse(data.data.getCookieConsentSettings);
      setSettings(tmpSettings);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    title,
    title_color,
    consent_text,
    consent_text_color,
    consent_location,
    accept_btn_text,
    decline_btn_text,
    section_color,
    accept_btn_color,
    accept_btn_hover_color,
    accept_btn_text_color,
    decline_btn_color,
    decline_btn_hover_color,
    decline_btn_text_color,
  } = settings;

  const COOKIE_NAME = 'cookie_consent';

  useEffect(() => {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!cookie) {
      setVisible(true);
    }
  }, []);

  const setCookie = () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    document.cookie = `${COOKIE_NAME}=true; expires=${oneYearFromNow.toUTCString()}; path=/`;
  };

  const handleAccept = () => {
    setCookie();
    setVisible(false);
  };

  const handleDecline = () => {
    setVisible(false);
  };

  const positionClasses = {
    top_left: 'top-4 left-4',
    top_center: 'top-4 left-1/2 -translate-x-1/2',
    top_right: 'top-4 right-4',
    center_left: 'top-1/2 left-4 -translate-y-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    center_right: 'top-1/2 right-4 -translate-y-1/2',
    bottom_left: 'bottom-4 left-4',
    bottom_center: 'bottom-4 left-1/2 -translate-x-1/2',
    bottom_right: 'bottom-4 right-4',
  };

  const positionClass = positionClasses[consent_location] || positionClasses.bottom_right;

  if (!visible) return null;

  return (
    <div
      className={`fixed z-50 p-4 rounded-lg shadow-lg max-w-sm transform ${positionClass}`}
      style={{ backgroundColor: section_color }}
    >
      <h2 className="text-lg font-bold mb-2" style={{ color: title_color }}>
        {title}
      </h2>
      <p
        className="text-sm mb-4"
        style={{ color: consent_text_color }}
        dangerouslySetInnerHTML={createSafeMarkup(consent_text)}
      ></p>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDecline}
          className="px-4 py-2 rounded shadow"
          style={{
            backgroundColor: decline_btn_color,
            color: decline_btn_text_color,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = decline_btn_hover_color;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = decline_btn_color;
          }}
        >
          {decline_btn_text}
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded shadow"
          style={{
            backgroundColor: accept_btn_color,
            color: accept_btn_text_color,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = accept_btn_hover_color;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = accept_btn_color;
          }}
        >
          {accept_btn_text}
        </button>
      </div>
    </div>
  );
};

export default Cookie;
