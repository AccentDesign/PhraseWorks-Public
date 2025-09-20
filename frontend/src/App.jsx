import { useEffect, useState } from 'react';
import { APICheckSystem } from './API/APISystem';
import { handleError } from './Utils/ErrorHandler';
import './App.css';

import Loading from './Admin/Components/Loading.jsx';
import CreateFirstUser from './Admin/Components/CreateFirstUser';
import AppRoutes from './AppRoutes.jsx';
import { ShortcodesProvider } from '@/Includes/Shortcodes/ShortcodesProvider';
import ErrorBoundary from './Components/ErrorBoundary';
import './Utils/ErrorLogger'; // Initialize global error logger

const LogoHeader = ({ subtitle }) => (
  <div className="flex flex-col items-center mb-8">
    <img src="/images/pw.svg" width="100" height="100" alt="Logo" />
    <h1 className="h2 text-gray-500 text-2xl">Phrase Works</h1>
    {subtitle && <h2 className="h2 text-gray-500 text-xl">{subtitle}</h2>}
  </div>
);

const CenteredScreen = ({ children }) => (
  <div className="bg-sand min-h-screen flex justify-center items-center">
    <div className="w-full flex flex-col justify-center items-center">{children}</div>
  </div>
);

function App() {
  const [system, setSystem] = useState(null);
  const [recheck, setRecheck] = useState(false);
  const [setup, setSetup] = useState(false);
  const [showBackendError, setShowBackendError] = useState(false);

  const checkSystem = async () => {
    try {
      const data = await APICheckSystem();
      const isInstalled = data.status === 200 && data.data.systemCheck.success;
      setSystem(isInstalled);
      localStorage.setItem('systemStatus', JSON.stringify(isInstalled));
    } catch (error) {
      await handleError(error, 'App.checkSystem');
      setSystem(false);
      setShowBackendError(true);
    }
  };

  const handleSetupClick = () => setSetup(true);

  useEffect(() => {
    const cachedSystem = localStorage.getItem('systemStatus');
    if (cachedSystem !== null) {
      setSystem(JSON.parse(cachedSystem));
    } else {
      checkSystem();
    }
  }, []);

  useEffect(() => {
    if (recheck == true) {
      setRecheck(false);
      checkSystem();
    }
  }, [recheck]);

  const renderSetupScreen = () => (
    <CenteredScreen>
      <LogoHeader subtitle="Setup..." />
      <CreateFirstUser setRecheck={setRecheck} />
    </CenteredScreen>
  );

  const renderNotSetupScreen = () => (
    <CenteredScreen>
      <LogoHeader />
      <p className="text-gray-500 mt-8">Database has not been set up yet...</p>
      <div className="card">
        <button
          className="mt-4 w-full cursor-pointer text-white bg-mid-teal hover:bg-lighter-teal font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={handleSetupClick}
        >
          Set Up
        </button>
      </div>
    </CenteredScreen>
  );

  if (system === null && !showBackendError) return <Loading />;
  if (!system && showBackendError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error!</span> Site backend is not responding...
        </div>
      </div>
    );
  }
  if (system) {
    return (
      <ErrorBoundary context="app">
        <ShortcodesProvider>
          <AppRoutes />
        </ShortcodesProvider>
      </ErrorBoundary>
    );
  }

  return setup ? renderSetupScreen() : renderNotSetupScreen();
}

export default App;
