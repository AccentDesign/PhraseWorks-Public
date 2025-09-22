import React, { useEffect, useRef, useState } from 'react';

const Mailer = ({
  mailer,
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
    <div>
      {mailer == 'default' && (
        <div className="p-4 bg-gray-200 rounded mt-2">
          You currently have the Default (none) mailer selected, which won't improve email
          deliverability. Please select any other email provider.
        </div>
      )}
      {mailer == 'smtp' && (
        <>
          <div className="mt-2">
            <p>
              The Other SMTP option lets you send emails through an SMTP server instead of using a
              provider's API. This is easy and convenient, but it's less secure than the other
              mailers. Please note that your provider may not allow you to send a large number of
              emails. In that case, please use a different mailer.
            </p>
          </div>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">SMTP Host</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="text"
                    placeholder="SMTP Host"
                    className="border p-2 rounded w-full text-black"
                    value={smtpHost}
                    onChange={(e) => {
                      setSMTPHost(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">Encryption</td>
                <td className="lg:w-3/4 p-4">
                  <div className="flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="encryption"
                        value="none"
                        checked={encryption === 'none'}
                        onChange={() => {
                          setEncryption('none');
                          setSMTPPort(1025);
                        }}
                        className="form-radio"
                      />
                      <span className="ml-2">None</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="encryption"
                        value="tls"
                        checked={encryption === 'tls'}
                        onChange={() => {
                          setEncryption('tls');
                          setSMTPPort(587);
                        }}
                        className="form-radio"
                      />
                      <span className="ml-2">TLS</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="encryption"
                        value="ssl"
                        checked={encryption === 'ssl'}
                        onChange={() => {
                          setEncryption('ssl');
                          setSMTPPort(465);
                        }}
                        className="form-radio"
                      />
                      <span className="ml-2">SSL</span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">SMTP Port</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="number"
                    placeholder="SMTP Port"
                    className="border p-2 rounded w-full text-black"
                    value={smtpPort}
                    onChange={(e) => {
                      setSMTPPort(Number(e.target.value));
                    }}
                    min={1}
                    max={65535}
                  />
                </td>
              </tr>
              <tr>
                <td className="w-1/4 pr-4 py-4 font-bold align-top">Auto TLS</td>
                <td className="w-3/4 p-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTLS}
                      onChange={(e) => {
                        setAutoTLS(e.target.checked);
                      }}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">
                      {autoTLS ? 'ON' : 'OFF'}
                    </span>
                  </label>
                  <span className="block italic text-gray-500 text-sm">
                    By default, TLS encryption is automatically used if the server supports it
                    (recommended). In some cases, due to server misconfigurations, this can cause
                    issues and may need to be disabled.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="w-1/4 pr-4 py-4 font-bold align-top">Authentication</td>
                <td className="w-3/4 p-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={authentication}
                      onChange={(e) => {
                        setAuthentication(e.target.checked);
                      }}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">
                      {authentication ? 'ON' : 'OFF'}
                    </span>
                  </label>
                </td>
              </tr>
              {authentication && (
                <>
                  <tr>
                    <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">SMTP Username</td>
                    <td className="lg:w-3/4 p-4">
                      <input
                        type="text"
                        placeholder="SMTP Username"
                        className="border p-2 rounded w-full text-black"
                        value={smtpUserName}
                        onChange={(e) => {
                          setSMTPUserName(e.target.value);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">SMTP Password</td>
                    <td className="lg:w-3/4 p-4">
                      <input
                        type="text"
                        placeholder="SMTP Password"
                        className="border p-2 rounded w-full text-black"
                        value={smtpPassword}
                        onChange={(e) => {
                          setSMTPPassword(e.target.value);
                        }}
                      />
                      <span className="block italic text-gray-500 text-sm">
                        The password is encrypted in the database, but for improved security we
                        recommend using your site's WordPress configuration file to set your
                        password.
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </>
      )}
      {mailer == 'brevo' && (
        <>
          <div className="mt-2">
            <p>
              Brevo (formerly Sendinblue) is one of our recommended mailers. It's a transactional
              email provider with scalable price plans, so it's suitable for any size of business.
            </p>
            <p className="mt-2">
              If you're just starting out, you can use Brevo's free plan to send up to 300 emails a
              day. You don't need to use a credit card to try it out. When you're ready, you can
              upgrade to a higher plan to increase your sending limits.
            </p>
          </div>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">API Key</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="text"
                    placeholder="API Key"
                    className="border p-2 rounded w-full text-black"
                    value={brevoAPIKey}
                    onChange={(e) => {
                      setBrevoAPIKey(e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">Sending Domain</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="text"
                    placeholder="Sending Domain"
                    className="border p-2 rounded w-full text-black"
                    value={brevoSendingDomain}
                    onChange={(e) => {
                      setBrevoSendingDomain(e.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {mailer == 'mailgun' && (
        <>
          <div className="mt-2">
            <p>
              Mailgun is a transactional email provider that offers a generous 3-month free trial.
              After that, it offers a 'Pay As You Grow' plan that allows you to pay for what you use
              without committing to a fixed monthly rate.
            </p>
          </div>
          <table className="w-full mt-4">
            <tbody>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">API Key</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="text"
                    placeholder="API Key"
                    className="border p-2 rounded w-full text-black"
                    value={mailgunAPIKey}
                    onChange={(e) => {
                      setMailgunAPIKey(e.target.value);
                    }}
                  />
                  <span className="block italic text-gray-500 text-sm">
                    Follow this link to{' '}
                    <a
                      href="https://app.mailgun.com/settings/api_security"
                      target="_blank"
                      className="text-blue-500 hover:text-blue-700 hover:underline hover:underline-offset-4"
                    >
                      get a Mailgun API Key
                    </a>
                    . Generate a key in the "Mailgun API Keys" section.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">Domain Name</td>
                <td className="lg:w-3/4 p-4">
                  <input
                    type="text"
                    placeholder="Sending Domain"
                    className="border p-2 rounded w-full text-black"
                    value={mailgunDomainName}
                    onChange={(e) => {
                      setMailgunDomainName(e.target.value);
                    }}
                  />
                  <span className="block italic text-gray-500 text-sm">
                    Follow this link to get a Domain Name from Mailgun:{' '}
                    <a
                      href="https://app.mailgun.com/mg/sending/domains"
                      target="_blank"
                      className="text-blue-500 hover:text-blue-700 hover:underline hover:underline-offset-4"
                    >
                      Get a Domain Name
                    </a>
                    .
                  </span>
                </td>
              </tr>
              <tr>
                <td className="lg:w-1/4 pr-4 py-4 font-bold align-top">Region</td>
                <td className="lg:w-3/4 p-4">
                  <div className="flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mailgunRegion"
                        value="us"
                        checked={mailgunRegion === 'us'}
                        onChange={() => {
                          setMailgunRegion('us');
                        }}
                        className="form-radio"
                      />
                      <span className="ml-2">US</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="mailgunRegion"
                        value="eu"
                        checked={mailgunRegion === 'eu'}
                        onChange={() => {
                          setMailgunRegion('eu');
                        }}
                        className="form-radio"
                      />
                      <span className="ml-2">EU</span>
                    </label>
                  </div>
                  <span className="block italic text-gray-500 text-sm mt-2">
                    Define which endpoint you want to use for sending messages.
                  </span>
                  <span className="block italic text-gray-500 text-sm mt-2">
                    If you are operating under EU laws, you may be required to use EU region.{' '}
                    <a
                      href="https://www.mailgun.com/regions"
                      target="_blank"
                      className="text-blue-500 hover:text-blue-700 hover:underline hover:underline-offset-4"
                    >
                      More information
                    </a>{' '}
                    on Mailgun.com.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
      {mailer == 'rackspace' && (
        <div className="p-4 bg-red-200 text-red-800 rounded mt-2">
          Rackspace is not yet supported.
        </div>
      )}
    </div>
  );
};

export default Mailer;
