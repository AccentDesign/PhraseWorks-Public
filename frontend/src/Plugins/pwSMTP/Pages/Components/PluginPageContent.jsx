import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Dashboard/TitleBar';
import Tabs from './Dashboard/Tabs';
import General from './Dashboard/General';
import EmailLogs from './Dashboard/EmailLogs';
import Alerts from './Dashboard/Alerts';
import Misc from './Dashboard/Misc';
import { APIGetPWSMTPData, APISendTestEmail, APIUpdatePWSMTPData } from '../../API/APIPWSMTP';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import TestEmail from './Dashboard/TestEmail';
import { notify } from '../../../../Utils/Notification';

const PluginPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [currentTab, setCurrentTab] = useState('general');
  const [apiDetails, setApiDetails] = useState({});
  const [clickLinkTracking, setClickLinkTracking] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [emailAlertEmail, setEmailAlertEmail] = useState('');
  const [enabledEmailLog, setEnabledEmailLog] = useState(true);
  const [forceFromEmail, setForceFromEmail] = useState(false);
  const [forceFromName, setForceFromName] = useState(false);
  const [fromEmail, setFromEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [logEmailContent, setLogEmailContent] = useState(true);
  const [logRetention, setLogRetention] = useState('1 Week');
  const [mailer, setMailer] = useState('default');
  const [notifyDeliveryHardBounce, setNotifyDeliveryHardBounce] = useState(false);
  const [notifyInitial, setNotifyInitial] = useState(true);
  const [openEmailTracking, setOpenEmailTracking] = useState(false);
  const [returnPath, setReturnPath] = useState(true);
  const [saveAttachments, setSaveAttachments] = useState(false);
  const [stopSending, setStopSending] = useState(false);
  const [testTo, setTestTo] = useState('');

  const [smtpHost, setSMTPHost] = useState('');
  const [encryption, setEncryption] = useState('none');
  const [smtpPort, setSMTPPort] = useState(1025);
  const [autoTLS, setAutoTLS] = useState(false);
  const [authentication, setAuthentication] = useState(false);
  const [smtpUserName, setSMTPUserName] = useState('');
  const [smtpPassword, setSMTPPassword] = useState('');
  const [brevoAPIKey, setBrevoAPIKey] = useState('');
  const [brevoSendingDomain, setBrevoSendingDomain] = useState('');
  const [mailgunAPIKey, setMailgunAPIKey] = useState('');
  const [mailgunDomainName, setMailgunDomainName] = useState('');
  const [mailgunRegion, setMailgunRegion] = useState('us');

  const fetchData = async () => {
    const data = await APIGetPWSMTPData();
    if (data.status == 200 && data.data.getPWSMTPData) {
      const parsed = JSON.parse(data.data.getPWSMTPData);

      setApiDetails(parsed.api_details ?? {});
      setClickLinkTracking(parsed.click_link_tracking ?? false);
      setEmailAlerts(parsed.email_alerts ?? false);
      setEnabledEmailLog(parsed.enabled_email_log ?? true);
      setForceFromEmail(parsed.force_from_email ?? false);
      setForceFromName(parsed.force_from_name ?? false);
      setFromEmail(parsed.from_email ?? '');
      setFromName(parsed.from_name ?? '');
      setLogEmailContent(parsed.log_email_content ?? true);
      setLogRetention(parsed.log_retention ?? '1 Week');
      setMailer(parsed.mailer ?? 'default');
      setNotifyDeliveryHardBounce(parsed.notify_delivery_hard_bounce ?? false);
      setNotifyInitial(parsed.notify_initial ?? true);
      setOpenEmailTracking(parsed.open_email_tracking ?? false);
      setReturnPath(parsed.return_path ?? true);
      setSaveAttachments(parsed.save_attachments ?? false);
      setStopSending(parsed.stop_sending ?? false);
      setEmailAlertEmail(parsed.emailAlertEmail ?? '');
    }
  };

  useEffect(() => {
    if (!apiDetails) return;

    setSMTPHost(apiDetails.smtpHost || '');
    setEncryption(apiDetails.encryption || 'none');
    setSMTPPort(apiDetails.smtpPort || 1025);
    setAutoTLS(apiDetails.autoTLS || false);
    setAuthentication(apiDetails.authentication || false);
    setSMTPUserName(apiDetails.smtpUserName || '');
    setSMTPPassword(apiDetails.smtpPassword || '');
    setBrevoAPIKey(apiDetails.brevoAPIKey || '');
    setBrevoSendingDomain(apiDetails.brevoSendingDomain || '');
    setMailgunAPIKey(apiDetails.mailgunAPIKey || '');
    setMailgunDomainName(apiDetails.mailgunDomainName || '');
    setMailgunRegion(apiDetails.mailgunRegion || 'us');
  }, [apiDetails]);

  const sendTest = async () => {
    const data = await APISendTestEmail(loginPassword, testTo);
    if (data.status == 200 && data.data.sendTestEmail.success) {
      notify('Test Email Sent', 'success');
      setTestTo('');
    } else {
      notify('Test Email Failed to Send', 'error');
    }
  };

  const save = async () => {
    const dataToSave = {
      api_details: apiDetails,
      click_link_tracking: clickLinkTracking,
      email_alerts: emailAlerts,
      enabled_email_log: enabledEmailLog,
      force_from_email: forceFromEmail,
      force_from_name: forceFromName,
      from_email: fromEmail,
      from_name: fromName,
      log_email_content: logEmailContent,
      log_retention: logRetention,
      mailer: mailer,
      notify_delivery_hard_bounce: notifyDeliveryHardBounce,
      notify_initial: notifyInitial,
      open_email_tracking: openEmailTracking,
      return_path: returnPath,
      save_attachments: saveAttachments,
      stop_sending: stopSending,
      emailAlertEmail: emailAlertEmail,
    };
    const data = await APIUpdatePWSMTPData(loginPassword, dataToSave);
    if (data.status == 200 && data.data.updatePWSMTPData.success) {
      notify('Successfully updated', 'success');
    } else {
      notify('Faild to update', 'error');
    }
  };

  useEffect(() => {
    const currentApiDetails = {
      smtpHost,
      encryption,
      smtpPort,
      autoTLS,
      authentication,
      smtpUserName,
      smtpPassword,
      brevoAPIKey,
      brevoSendingDomain,
      mailgunAPIKey,
      mailgunDomainName,
      mailgunRegion,
    };

    setApiDetails(currentApiDetails);
  }, [
    smtpHost,
    encryption,
    smtpPort,
    autoTLS,
    authentication,
    smtpUserName,
    smtpPassword,
    brevoAPIKey,
    brevoSendingDomain,
    mailgunAPIKey,
    mailgunDomainName,
    mailgunRegion,
    setApiDetails,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="PW SMTP" save={save} />

      <div className="panel mt-4">
        <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        {currentTab == 'general' && (
          <General
            fromEmail={fromEmail}
            setFromEmail={setFromEmail}
            forceFromEmail={forceFromEmail}
            setForceFromEmail={setForceFromEmail}
            fromName={fromName}
            setFromName={setFromName}
            forceFromName={forceFromName}
            setForceFromName={setForceFromName}
            returnPath={returnPath}
            setReturnPath={setReturnPath}
            mailer={mailer}
            setMailer={setMailer}
            apiDetails={apiDetails}
            setApiDetails={setApiDetails}
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
        )}
        {currentTab == 'testEmail' && (
          <TestEmail testTo={testTo} setTestTo={setTestTo} sendTest={sendTest} />
        )}
        {currentTab == 'emailLog' && (
          <EmailLogs
            enabledEmailLog={enabledEmailLog}
            setEnabledEmailLog={setEnabledEmailLog}
            logEmailContent={logEmailContent}
            setLogEmailContent={setLogEmailContent}
            saveAttachments={saveAttachments}
            setSaveAttachments={setSaveAttachments}
            openEmailTracking={openEmailTracking}
            setOpenEmailTracking={setOpenEmailTracking}
            clickLinkTracking={clickLinkTracking}
            setClickLinkTracking={setClickLinkTracking}
            logRetention={logRetention}
            setLogRetention={setLogRetention}
          />
        )}
        {currentTab == 'alerts' && (
          <Alerts
            notifyInitial={notifyInitial}
            setNotifyInitial={setNotifyInitial}
            notifyDeliveryHardBounce={notifyDeliveryHardBounce}
            setNotifyDeliveryHardBounce={setNotifyDeliveryHardBounce}
            emailAlerts={emailAlerts}
            setEmailAlerts={setEmailAlerts}
          />
        )}
        {currentTab == 'misc' && <Misc stopSending={stopSending} setStopSending={setStopSending} />}
      </div>
    </div>
  );
};

export default PluginPageContent;
