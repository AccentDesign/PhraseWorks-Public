import React, { useContext, useEffect, useState } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { APIGetDashboardAtAGlanceData, APIGetTheme } from '../../../API/APISystem';
import { FaPenAlt } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';
import { Link } from 'react-router-dom';

const AtAGlance = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [version, setVersion] = useState('');
  const [posts, setPosts] = useState(0);
  const [pages, setPages] = useState(0);
  const [theme, setTheme] = useState(0);

  const fetchData = async () => {
    const data = await APIGetDashboardAtAGlanceData(loginPassword);
    if (data.status == 200) {
      setVersion(data.data.getDashboardAtAGlanceData.version);
      setPosts(data.data.getDashboardAtAGlanceData.posts);
      setPages(data.data.getDashboardAtAGlanceData.pages);
    }
    const themeData = await APIGetTheme(loginPassword);
    if (themeData.status == 200) {
      setTheme(themeData.data.getTheme);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative overflow-x-auto bg-white shadow-md sm:rounded-lg p-4 w-full w-full md:w-1/2">
      <h3 className="font-bold text-lg">At A Glance</h3>
      <hr className="my-4" />
      <div className="flex flex-row gap-4 items-center">
        <p className="w-1/2 ">
          <Link to="/admin/posts" className="flex flex-row gap-2 items-center">
            <FaPenAlt className="w-6 h-6 text-gray-600" />
            {posts} Post{posts > 0 && posts > 1 ? 's' : ''}
          </Link>
        </p>
        <p className="w-1/2">
          <Link to="/admin/pages" className="flex flex-row gap-2 items-center">
            <IoIosDocument className="w-6 h-6 text-gray-600" />
            {pages} Page{pages > 0 && pages > 1 ? 's' : ''}
          </Link>
        </p>
      </div>
      <hr className="my-4" />

      <p>
        PhraseWorks {version} running{' '}
        <Link to="/admin/appearance" className="text-blue-800 hover:text-blue-500">
          {theme.name}
        </Link>{' '}
        theme.
      </p>
    </div>
  );
};

export default AtAGlance;
