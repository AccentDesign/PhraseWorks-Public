import React from 'react';
import { APIGetPlugins, APILogError, APIUpdatePlugins } from '../../API/APISystem';
import { useContext } from 'react';
import { APIConnectorContext } from '../../Contexts/APIConnectorContext';
import { useEffect } from 'react';
import TitleBar from './Plugins/TitleBar';
import ListView from './Plugins/ListView';
import { useState } from 'react';
import { notify } from '../../Utils/Notification';
import AddPlugins from './Plugins/AddPlugins';

const PluginsPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [plugins, setPlugins] = useState([]);

  const [sliderOpen, setSliderOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleAllCheckboxes = () => {
    if (selectedIds.length === plugins.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(plugins.map((post, idx) => idx));
    }
  };

  const allSelected = plugins.length > 0 && selectedIds.length === plugins.length;

  const activatePlugin = async (idx) => {
    const tmpPlugins = [...plugins];
    tmpPlugins[idx] = {
      ...tmpPlugins[idx],
      active: true,
    };

    setPlugins(tmpPlugins);
    try {
      const data = await APIUpdatePlugins(loginPassword, tmpPlugins);
      if (data.status === 200 && data.data.updatePlugins.success) {
        notify('Successfully updated plugins', 'success');
      } else {
        notify('Failed to update plugins', 'error');
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Plugin update failed', err);
    }
  };
  const deactivatePlugin = async (idx) => {
    const tmpPlugins = [...plugins];
    tmpPlugins[idx] = {
      ...tmpPlugins[idx],
      active: false,
    };

    setPlugins(tmpPlugins);
    const data = await APIUpdatePlugins(loginPassword, tmpPlugins);
    if (data.status == 200) {
      if (data.data.updatePlugins.success) {
        notify('Successfully updated plugins', 'success');
      } else {
        notify('Failed to update plugins', 'error');
      }
    } else {
      notify('Failed to update plugins', 'error');
    }
  };

  const fetchData = async () => {
    const data = await APIGetPlugins(loginPassword);
    if (data.status === 200) {
      setPlugins(JSON.parse(data.data.getPlugins));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full">
      <TitleBar setSliderOpen={setSliderOpen} sliderOpen={sliderOpen} />
      <div className="panel mt-8">
        <ListView
          plugins={plugins}
          selectedIds={selectedIds}
          toggleCheckbox={toggleCheckbox}
          activatePlugin={activatePlugin}
          deactivatePlugin={deactivatePlugin}
          allSelected={allSelected}
          toggleAllCheckboxes={toggleAllCheckboxes}
        />
      </div>
      <AddPlugins sliderOpen={sliderOpen} setSliderOpen={setSliderOpen} fetchData={fetchData} />
    </div>
  );
};

export default PluginsPageContent;
