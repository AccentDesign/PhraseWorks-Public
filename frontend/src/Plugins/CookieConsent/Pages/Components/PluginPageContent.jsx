import React, { useContext, useState } from 'react';
import TitleBar from './TitleBar';
import Content from './Content';
import { HexColorPicker } from 'react-colorful';
import 'react-colorful';
import { APIConnectorContext } from '@/Contexts/APIConnectorContext';
import { useEffect } from 'react';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';
import {
  APIGetCookieConsentSettings,
  APISaveCookieConsentSettings,
} from '../../API/APICookieConsent';
import { notify } from '../../../../Utils/Notification';

const PluginPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [sectionColor, setSectionColor] = useState('#000000');
  const [title, setTitle] = useState('');
  const [activeContentTab, setActiveContentTab] = useState('visual');
  const [content, setContent] = useState('');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [contentColor, setContentColor] = useState('#ffffff');
  const [consentLocation, setConsentLocation] = useState('bottom_right');
  const [acceptBtnText, setAcceptBtnText] = useState('Accept All');
  const [acceptBtnColor, setAcceptBtnColor] = useState('#175726ff');
  const [acceptBtnHoverColor, setAcceptBtnHoverColor] = useState('#1f7132ff');
  const [acceptBtnTextColor, setAcceptBtnTextColor] = useState('#ffffff');
  const [rejectBtnText, setRejectBtnText] = useState('Reject All');
  const [rejectBtnColor, setRejectBtnColor] = useState('#571717ff');
  const [rejectBtnHoverColor, setRejectBtnHoverColor] = useState('#711f1fff');
  const [rejectBtnTextColor, setRejectBtnTextColor] = useState('#ffffff');

  const HandleContentEditorChange = (content) => {
    setContent(content);
  };

  const HandleContentChange = (e) => {
    const newValue = e.target.value.trim() === '' ? '' : e.target.value;
    setContent(newValue);
  };

  const fetchData = async () => {
    const data = await APIGetCookieConsentSettings();
    if (data.status == 200) {
      const tmpSettings = JSON.parse(data.data.getCookieConsentSettings);
      setSectionColor(tmpSettings.section_color);
      setTitle(tmpSettings.title);
      setTitleColor(tmpSettings.title_color);
      setContent(tmpSettings.consent_text);
      setContentColor(tmpSettings.consent_text_color);
      setAcceptBtnText(tmpSettings.accept_btn_text);
      setAcceptBtnColor(tmpSettings.accept_btn_color);
      setAcceptBtnHoverColor(tmpSettings.accept_btn_hover_color);
      setAcceptBtnTextColor(tmpSettings.accept_btn_text_color);

      setRejectBtnText(tmpSettings.decline_btn_text);
      setRejectBtnColor(tmpSettings.decline_btn_color);
      setRejectBtnHoverColor(tmpSettings.decline_btn_hover_color);
      setRejectBtnTextColor(tmpSettings.decline_btn_text_color);
    }
  };

  const saveData = async () => {
    const newData = {
      title,
      title_color: titleColor,
      consent_text: content,
      consent_text_color: contentColor,
      consent_location: consentLocation,
      section_color: sectionColor,
      accept_btn_text: acceptBtnText,
      accept_btn_color: acceptBtnColor,
      accept_btn_hover_color: acceptBtnHoverColor,
      accept_btn_text_color: acceptBtnTextColor,
      decline_btn_text: rejectBtnText,
      decline_btn_color: rejectBtnColor,
      decline_btn_hover_color: rejectBtnHoverColor,
      decline_btn_text_color: rejectBtnTextColor,
    };

    const response = await APISaveCookieConsentSettings(loginPassword, newData);

    if (response.status === 200) {
      notify('Settings saved successfully!', 'success');
    } else {
      notify('Failed to save settings.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="Cookie Consent" />
      <div className="panel mt-8">
        <p className="pb-2">Consent Location</p>
        <select
          name="consent_location"
          value={consentLocation}
          onChange={(e) => setConsentLocation(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">Select a position</option>
          <option value="top_left">Top Left</option>
          <option value="top_center">Top Center</option>
          <option value="top_right">Top Right</option>
          <option value="center_left">Center Left</option>
          <option value="center">Center</option>
          <option value="center_right">Center Right</option>
          <option value="bottom_left">Bottom Left</option>
          <option value="bottom_center">Bottom Center</option>
          <option value="bottom_right">Bottom Right</option>
        </select>

        <hr className="my-8" />

        <p className="pb-2">Consent Color</p>
        <HexColorPicker color={sectionColor} onChange={setSectionColor} />
        <div
          className="pl-4 mt-5 border-l-8 rounded-sm"
          style={{ borderLeftColor: sectionColor, borderLeftWidth: '24px' }}
        >
          Current color is <span className="font-mono">{sectionColor}</span>
        </div>

        <hr className="my-8" />

        <p className="pb-2">
          Consent Title <span className="text-red-800">(Required)</span>
        </p>
        <p className="pb-2">
          <input
            type="text"
            name="form_title"
            className="border p-2 rounded w-full"
            placeholder="Form Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </p>

        <hr className="my-8" />

        <p className="pb-2">Title Color</p>
        <HexColorPicker color={titleColor} onChange={setTitleColor} />
        <div
          className="pl-4 mt-5 border-l-8 rounded-sm"
          style={{ borderLeftColor: titleColor, borderLeftWidth: '24px' }}
        >
          Current color is <span className="font-mono">{titleColor}</span>
        </div>

        <hr className="my-8" />

        <p className="pt-4">
          Consent Content <span className="text-red-800">(Required)</span>
        </p>
        <Content
          activeContentTab={activeContentTab}
          setActiveContentTab={setActiveContentTab}
          content={content}
          HandleContentEditorChange={HandleContentEditorChange}
          HandleContentChange={HandleContentChange}
        />

        <hr className="my-8" />

        <p className="pb-2">Content Color</p>
        <HexColorPicker color={contentColor} onChange={setContentColor} />
        <div
          className="pl-4 mt-5 border-l-8 rounded-sm"
          style={{ borderLeftColor: contentColor, borderLeftWidth: '24px' }}
        >
          Current color is <span className="font-mono">{contentColor}</span>
        </div>

        <hr className="my-8" />

        <p className="pb-2">Accept Button Text</p>
        <p className="pb-2">
          <input
            type="text"
            name="form_title"
            className="border p-2 rounded w-full"
            placeholder="Form Title"
            value={acceptBtnText}
            onChange={(e) => {
              setAcceptBtnText(e.target.value);
            }}
          />
        </p>

        <hr className="my-8" />

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="">
            <p className="pb-2">Accept Button Color</p>
            <HexColorPicker color={acceptBtnColor} onChange={setAcceptBtnColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: acceptBtnColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{acceptBtnColor}</span>
            </div>
          </div>
          <div className="">
            <p className="pb-2">Accept Button Hover Color</p>
            <HexColorPicker color={acceptBtnHoverColor} onChange={setAcceptBtnHoverColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: acceptBtnHoverColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{acceptBtnHoverColor}</span>
            </div>
          </div>
          <div className="">
            <p className="pb-2">Accept Button Text Color</p>
            <HexColorPicker color={acceptBtnTextColor} onChange={setAcceptBtnTextColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: acceptBtnTextColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{acceptBtnTextColor}</span>
            </div>
          </div>
        </div>
        <p className="py-2">Example Accept Button</p>
        <button
          className="px-4 py-2 rounded shadow"
          style={{
            backgroundColor: acceptBtnColor,
            color: acceptBtnTextColor,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = acceptBtnHoverColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = acceptBtnColor;
          }}
        >
          {acceptBtnText}
        </button>

        <hr className="my-8" />

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="">
            <p className="pb-2">Reject Button Color</p>
            <HexColorPicker color={rejectBtnColor} onChange={setRejectBtnColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: rejectBtnColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{rejectBtnColor}</span>
            </div>
          </div>
          <div className="">
            <p className="pb-2">Reject Button Hover Color</p>
            <HexColorPicker color={rejectBtnHoverColor} onChange={setRejectBtnHoverColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: rejectBtnHoverColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{rejectBtnHoverColor}</span>
            </div>
          </div>
          <div className="">
            <p className="pb-2">Reject Button Text Color</p>
            <HexColorPicker color={rejectBtnTextColor} onChange={setRejectBtnTextColor} />
            <div
              className="pl-4 mt-5 border-l-8 rounded-sm"
              style={{ borderLeftColor: rejectBtnTextColor, borderLeftWidth: '24px' }}
            >
              Current color is <span className="font-mono">{rejectBtnTextColor}</span>
            </div>
          </div>
        </div>
        <p className="py-2">Example Reject Button</p>
        <button
          className="px-4 py-2 rounded shadow"
          style={{
            backgroundColor: rejectBtnColor,
            color: rejectBtnTextColor,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = rejectBtnHoverColor;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = rejectBtnColor;
          }}
        >
          {rejectBtnText}
        </button>

        <hr className="my-8" />

        <p className="py-2">Example Full Cookie Consent Panel</p>
        <div
          className={`p-4 rounded-lg shadow-lg max-w-sm`}
          style={{ backgroundColor: sectionColor }}
        >
          <h2 className="text-lg font-bold mb-2" style={{ color: titleColor }}>
            {title}
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: contentColor }}
            dangerouslySetInnerHTML={createSafeMarkup(content)}
          ></p>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded shadow"
              style={{
                backgroundColor: rejectBtnColor,
                color: rejectBtnTextColor,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = rejectBtnHoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = rejectBtnColor;
              }}
            >
              {rejectBtnText}
            </button>
            <button
              className="px-4 py-2 rounded shadow"
              style={{
                backgroundColor: acceptBtnColor,
                color: acceptBtnTextColor,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = acceptBtnHoverColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = acceptBtnColor;
              }}
            >
              {acceptBtnText}
            </button>
          </div>
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => saveData()}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PluginPageContent;
