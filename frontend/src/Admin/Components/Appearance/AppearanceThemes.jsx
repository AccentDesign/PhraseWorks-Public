import React, { useContext, useEffect, useState } from 'react';
import TitleBar from './Themes/TitleBar';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import ListView from './Themes/ListView';
import AddPanel from './Themes/AddPanel';
import EditPanel from './Themes/EditPanel';
import {
  APIDeleteTheme,
  APIGetTheme,
  APIGetThemes,
  APISetActiveTheme,
} from '../../../API/APISystem';

const availableThemes = import.meta.glob('/src/Content/*/Theme.md');

const AppearanceThemes = () => {
  const { loginPassword } = useContext(APIConnectorContext);

  const [themes, setThemes] = useState([]);
  const [invalidThemes, setInvalidThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState();
  const [reloadThemes, setReloadThemes] = useState(false);
  const [addSliderOpen, setAddSliderOpen] = useState(false);
  const [editSliderOpen, setEditSliderOpen] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState(null);

  const HandleClose = () => {};

  const deleteTheme = async (id) => {
    const data = await APIDeleteTheme(loginPassword, id);
    if (data.status == 200) {
      setReloadThemes(true);
    }
  };

  const updateActiveTheme = async (id) => {
    const data = await APISetActiveTheme(loginPassword, id);
    if (data.status == 200) {
      setReloadThemes(true);
    }
  };

  const fetchData = async (isMounted = true) => {
    const activeData = await APIGetTheme();
    if (isMounted && activeData.status == 200) {
      setActiveTheme(activeData.data.getTheme);
    }
    const data = await APIGetThemes(loginPassword);
    if (isMounted && data.status == 200) {
      const allThemes = data.data.getThemes.themes;

      const validThemes = allThemes.filter((theme) => {
        const expectedPath = `/src${theme.location}/Theme.md`;
        return expectedPath in availableThemes;
      });

      const invalidThemes = allThemes.filter((theme) => {
        const expectedPath = `/src${theme.location}/Theme.md`;
        return !(expectedPath in availableThemes);
      });

      setThemes(validThemes);
      setInvalidThemes(invalidThemes);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchData(isMounted);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const reload = async () => {
      if (reloadThemes) {
        await fetchData(isMounted);
        if (isMounted) setReloadThemes(false);
      }
    };

    reload();

    return () => {
      isMounted = false;
    };
  }, [reloadThemes]);

  return (
    <>
      <div className="w-full">
        <TitleBar setAddSliderOpen={setAddSliderOpen} />

        <div className="non-padded-panel mt-8">
          <ListView
            themes={themes}
            activeTheme={activeTheme}
            setThemeToEdit={setThemeToEdit}
            setEditSliderOpen={setEditSliderOpen}
            valid={true}
            deleteTheme={deleteTheme}
            updateActiveTheme={updateActiveTheme}
          />
        </div>

        <div className="non-padded-panel mt-8">
          <ListView
            themes={invalidThemes}
            activeTheme={activeTheme}
            setThemeToEdit={setThemeToEdit}
            setEditSliderOpen={setEditSliderOpen}
            valid={false}
          />
        </div>
      </div>
      <AddPanel
        addSliderOpen={addSliderOpen}
        setAddSliderOpen={setAddSliderOpen}
        HandleClose={HandleClose}
        setReloadThemes={setReloadThemes}
      />
      <EditPanel
        editSliderOpen={editSliderOpen}
        setEditSliderOpen={setEditSliderOpen}
        HandleClose={HandleClose}
        themeToEdit={themeToEdit}
        setThemeToEdit={setThemeToEdit}
        setReloadThemes={setReloadThemes}
      />
    </>
  );
};

export default AppearanceThemes;
