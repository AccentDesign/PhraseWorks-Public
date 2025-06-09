import { useEffect, useState } from 'react';
import { APIConnectorContextProvider } from './Contexts/APIConnectorContext';
import { UserContextProvider } from './Contexts/UserContext';
import { APICheckSystem } from './API/APISystem';
import { APIGetNavigationPostsAndPages } from './API/APIPosts';
import './App.css';

import Loading from './Admin/Components/Loading.jsx';
import CreateFirstUser from './Admin/Components/CreateFirstUser';
import AppRoutes from './AppRoutes.jsx';
import { APIGetAuthors } from './API/APIUsers.js';

function App() {
  const [system, setSystem] = useState(null);
  const [setup, setSetup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [authors, setAuthors] = useState([]);

  const SetupSystem = async () => {
    setSetup(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await APICheckSystem();

        if (data.status === 200 && data.data.systemCheck.success === true) {
          setSystem(true);
          const dataPosts = await APIGetNavigationPostsAndPages();
          if (dataPosts.status == 200) {
            setPosts(dataPosts.data.getPostsAndPagesNavigation.posts);
          }
          const dataAuthors = await APIGetAuthors();
          if (dataAuthors.status == 200) {
            setAuthors(dataAuthors.data.getAuthors.users);
          }
        } else {
          setSystem(false);
        }
      } catch (error) {
        console.error('System check failed', error);
        setSystem(false);
      }
    };

    fetchData();
  }, []);

  const renderSetupScreen = () => (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0">
      <div className="flex flex-col md:flex-row min-h-screen px-8 md:px-0">
        <div className="w-full">
          <div className="flex flex-col min-h-screen justify-center items-center">
            <div className="flex align-items-center mb-2 justify-between">
              <img src="/images/accent-logo-desktop-white.svg" width="229" height="62" alt="Logo" />
            </div>
            <h1 className="h2 text-white text-2xl">Phrase Works</h1>
            <h2 className="h2 text-white text-xl">Setup...</h2>
            <CreateFirstUser />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotSetupScreen = () => (
    <div className="bg-gradient-to-b from-dark-teal from-20% to-mid-teal bg-fixed min-h-screen top-0">
      <div className="flex flex-col md:flex-row min-h-screen px-8 md:px-0">
        <div className="w-full">
          <div className="flex flex-col min-h-screen justify-center items-center">
            <div className="flex align-items-center mb-2 justify-between">
              <img src="/images/accent-logo-desktop-white.svg" width="229" height="62" alt="Logo" />
            </div>
            <h1 className="h2 text-white text-2xl">Phrase Works</h1>
            <p className="text-white mt-8">Database has not been set up yet...</p>
            <div className="card">
              <button
                className="mt-4 w-full cursor-pointer text-white bg-mid-teal hover:bg-lighter-teal focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={SetupSystem}
              >
                Set Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  if (system === null) return <Loading />;

  if (!posts || posts.length === 0) {
    return <Loading />;
  }

  return system ? (
    <APIConnectorContextProvider>
      <UserContextProvider>
        <AppRoutes posts={posts} authors={authors} />
      </UserContextProvider>
    </APIConnectorContextProvider>
  ) : setup ? (
    renderSetupScreen()
  ) : (
    renderNotSetupScreen()
  );
}

export default App;
