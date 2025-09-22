import React from 'react';
import Mailers from './Mailers';
import Mailer from './Mailer';

const General = ({
  fromEmail,
  setFromEmail,
  forceFromEmail,
  setForceFromEmail,
  fromName,
  setFromName,
  forceFromName,
  setForceFromName,
  returnPath,
  setReturnPath,
  mailer,
  setMailer,

  smtpHost,
  setSMTPHost,
  encryption,
  setEncryption,
  smtpPort,
  setSMTPPort,
  autoTLS,
  setAutoTLS,
  authentication,
  setAuthentication,
  smtpUserName,
  setSMTPUserName,
  smtpPassword,
  setSMTPPassword,
  brevoAPIKey,
  setBrevoAPIKey,
  brevoSendingDomain,
  setBrevoSendingDomain,
  mailgunAPIKey,
  setMailgunAPIKey,
  mailgunDomainName,
  setMailgunDomainName,
  mailgunRegion,
  setMailgunRegion,
}) => {
  return (
    <div className="p-4">
      <table className="w-full">
        <tbody>
          <tr>
            <td className="lg:w-1/4 p-4 font-bold align-top">From Email</td>
            <td className="lg:w-3/4 p-4">
              <input
                type="text"
                placeholder="From Email"
                className="border p-2 rounded w-full text-black"
                value={fromEmail}
                onChange={(e) => {
                  setFromEmail(e.target.value);
                }}
              />

              <span className="block italic text-gray-500 text-sm mb-4">
                The email address that emails are sent from.
              </span>
              <p>
                If you're using an email provider (Yahoo, Outlook.com, etc) this should be your
                email address for that account.
              </p>
              <p>
                Please note that other plugins can change this, to prevent this use the setting
                below.
              </p>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Force From Email</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceFromEmail}
                  onChange={(e) => {
                    setForceFromEmail(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {forceFromEmail ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm">
                If checked, the From Email setting above will be used for all emails, ignoring
                values set by other plugins.
              </span>
            </td>
          </tr>
          <tr>
            <td className="w-1/4 p-4 font-bold align-top">From Name</td>
            <td className="w-3/4 p-4">
              <input
                type="text"
                placeholder="From Name"
                className="border p-2 rounded w-full text-black"
                value={fromName}
                onChange={(e) => {
                  setFromName(e.target.value);
                }}
              />

              <span className="block italic text-gray-500 text-sm">
                The name that emails are sent from..
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Force From Name</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={forceFromName}
                  onChange={(e) => {
                    setForceFromName(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {forceFromEmail ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm">
                If checked, the From Name setting above will be used for all emails, ignoring values
                set by other plugins.
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Return Path</td>
            <td className="w-3/4 p-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={returnPath}
                  onChange={(e) => {
                    setReturnPath(e.target.checked);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {returnPath ? 'ON' : 'OFF'}
                </span>
              </label>
              <span className="block italic text-gray-500 text-sm">
                Return Path indicates where non-delivery receipts - or bounce messages - are to be
                sent. If unchecked, bounce messages may be lost.
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-1/4 p-4 font-bold align-top">Mailer</td>
            <td className="w-3/4 p-4">
              <Mailers mailer={mailer} setMailer={setMailer} />
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="w-full p-4" colSpan={2}>
              <h2 className="text-xl font-bold">
                {mailer == 'default'
                  ? 'Default'
                  : mailer == 'brevo'
                  ? 'Brevo'
                  : mailer == 'mailgun'
                  ? 'Mailgun'
                  : mailer == 'smtp'
                  ? 'SMTP'
                  : 'Rackspace'}{' '}
                Mailer Details
              </h2>
              <Mailer
                mailer={mailer}
                smtpHost={smtpHost}
                setSMTPHost={setSMTPHost}
                encryption={encryption}
                setEncryption={setEncryption}
                smtpPort={smtpPort}
                setSMTPPort={setSMTPPort}
                autoTLS={autoTLS}
                setAutoTLS={setAutoTLS}
                authentication={authentication}
                setAuthentication={setAuthentication}
                smtpUserName={smtpUserName}
                setSMTPUserName={setSMTPUserName}
                smtpPassword={smtpPassword}
                setSMTPPassword={setSMTPPassword}
                brevoAPIKey={brevoAPIKey}
                setBrevoAPIKey={setBrevoAPIKey}
                brevoSendingDomain={brevoSendingDomain}
                setBrevoSendingDomain={setBrevoSendingDomain}
                mailgunAPIKey={mailgunAPIKey}
                setMailgunAPIKey={setMailgunAPIKey}
                mailgunDomainName={mailgunDomainName}
                setMailgunDomainName={setMailgunDomainName}
                mailgunRegion={mailgunRegion}
                setMailgunRegion={setMailgunRegion}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default General;
