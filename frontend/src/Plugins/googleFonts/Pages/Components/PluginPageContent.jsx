import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Dashboard/TitleBar';
import { APIDownloadGoogleFont, APIGetGoogleFonts } from '../../API/APIGoogleFonts';
import Pagination from './Dashboard/Pagination';
import { notify } from '../../../../Utils/Notification';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';

const PluginPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [paginatedFonts, setPaginatedFonts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 🔍 New
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadFontFromGoogle = (fontFamily) => {
    const fontParam = fontFamily.replace(/ /g, '+');
    const id = `font-${fontParam}`;

    if (document.getElementById(id)) return; // Already loaded

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontParam}&display=swap`;
    document.head.appendChild(link);
  };

  const fetchData = async () => {
    const data = await APIGetGoogleFonts();
    if (data.status == 200 && data.data.getGoogleFonts) {
      const fontsData = JSON.parse(data.data.getGoogleFonts);
      setFonts(fontsData);
      setFilteredFonts(fontsData); // 🔍 Set initial filtered list
    }
  };

  const installFont = async (font) => {
    const data = await APIDownloadGoogleFont(loginPassword, font);
    if (data.status == 200 && data.data.downloadGoogleFont.success) {
      notify('Successfully installed font', 'success');
    }
  };

  // 🔍 Filter fonts based on search term
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = fonts.filter((font) => font.family.toLowerCase().includes(term));
    setFilteredFonts(filtered);
    setPage(1); // Reset page when searching
  }, [searchTerm, fonts]);

  useEffect(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    setPaginatedFonts(filteredFonts.slice(start, end));
  }, [filteredFonts, page]);

  useEffect(() => {
    paginatedFonts.forEach((font) => {
      loadFontFromGoogle(font.family);
    });
  }, [paginatedFonts]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full px-4 py-4">
      <TitleBar title="Google Fonts Plugin" />

      <div className="my-4">
        <input
          type="text"
          placeholder="Search fonts..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="panel mt-4">
        {paginatedFonts.length > 0 ? (
          <ul className="space-y-2">
            {paginatedFonts.map((font) => (
              <li key={font.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">{font.family}</p>
                  <p style={{ fontFamily: font.family }} className="text-2xl text-gray-600">
                    The quick brown fox jumps over the lazy dog.
                  </p>
                  <p className="text-sm text-gray-500">
                    Variants: {font.variants?.join(', ') || 'N/A'}
                  </p>
                </div>
                {__DEV__ ? (
                  <button onClick={() => installFont(font)} className="btn btn-primary">
                    Install
                  </button>
                ) : (
                  <p>Must be in dev mode to install</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No fonts found.</p>
        )}

        <Pagination
          totalFonts={filteredFonts.length}
          page={page}
          perPage={perPage}
          setPage={setPage}
        />
      </div>
    </div>
  );
};

export default PluginPageContent;
