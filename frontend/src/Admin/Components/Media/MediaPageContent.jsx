import React, { useContext, useEffect, useRef, useState } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import { APIGetFile, APISendUpload, APIGetFiles, APIDeleteFiles } from '../../../API/APIMedia.js';
import TitleBar from './MediaPage/TitleBar.jsx';
import SearchBar from './MediaPage/SearchBar.jsx';
import ActionsButton from './MediaPage/ActionsButton.jsx';
import ListView from './MediaPage/ListView.jsx';
import BoxView from './MediaPage/BoxView.jsx';
import Pagination from './MediaPage/Pagination.jsx';
import Upload from './MediaPage/Upload.jsx';
import Detail from './MediaPage/Detail.jsx';

const MediaPageContent = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);
  const [detailsId, setDetailsId] = useState(null);
  const [view, setView] = useState('squares');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const perPage = 20;

  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderDetailsOpen, setSliderDetailsOpen] = useState(false);
  const [applyTriggered, setApplyTriggered] = useState(false);
  const HandleClose = () => {};

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleApply = async () => {
    if (bulkAction === 'delete' && selectedIds.length > 0) {
      await APIDeleteFiles(loginPassword, selectedIds);
      fetchData();
      setSliderDetailsOpen(false);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const ShowDetails = (id) => {
    setDetailsId(id);
    setSliderDetailsOpen(true);
  };

  const SendData = async () => {
    const inputFiles = fileInputRef.current.files;
    if (!inputFiles.length) return;
    try {
      const result = await APISendUpload(loginPassword, Array.from(inputFiles));
      if (result.status == 200) {
        const key = file.name;
        const imgBlob = await APIGetFile(key);

        const url = URL.createObjectURL(imgBlob);
        setImgUrl(url);
        setPage(1);
        fetchData();
      }
    } catch (err) {
      console.error('Upload or fetch failed:', err);
    }
  };

  const fetchData = async () => {
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, type, search);
    if (data.status == 200) {
      const tmpFiles = [];
      setTotalFiles(data.data.getMediaFiles.total);
      data.data.getMediaFiles.files.map((file) => {
        const url = `http://localhost:8787/r2/${file.filename}`;
        const newData = {
          id: file.id,
          filename: file.filename,
          mimetype: file.mimetype,
          url: url,
          author: file.author,
          date: file.date,
          attachment_metadata: JSON.parse(file.attachment_metadata),
        };
        tmpFiles.push(newData);
      });
      setFiles(tmpFiles);
    }
  };

  useEffect(() => {
    if (applyTriggered && bulkAction === 'delete') {
      handleApply();
      setApplyTriggered(false); // reset after apply
    }
  }, [bulkAction, applyTriggered]);

  useEffect(() => {
    fetchData();
  }, [page, type, search]);

  return (
    <>
      <div className="w-full">
        <TitleBar setSliderOpen={setSliderOpen} />
        <SearchBar
          view={view}
          setView={setView}
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
        />
        {view == 'list' && (
          <ActionsButton
            bulkAction={bulkAction}
            setBulkAction={setBulkAction}
            handleApply={handleApply}
          />
        )}

        <div className="panel mt-8mt-8">
          {view == 'list' ? (
            <ListView files={files} selectedIds={selectedIds} toggleCheckbox={toggleCheckbox} />
          ) : (
            <BoxView files={files} ShowDetails={ShowDetails} />
          )}
          <Pagination totalFiles={totalFiles} page={page} perPage={perPage} setPage={setPage} />
        </div>
      </div>
      <Upload
        sliderOpen={sliderOpen}
        setSliderOpen={setSliderOpen}
        HandleClose={HandleClose}
        imgUrl={imgUrl}
        handleChange={handleChange}
        SendData={SendData}
        fileInputRef={fileInputRef}
      />
      <Detail
        sliderDetailsOpen={sliderDetailsOpen}
        setSliderDetailsOpen={setSliderDetailsOpen}
        HandleClose={HandleClose}
        files={files}
        detailsId={detailsId}
        toggleCheckbox={toggleCheckbox}
        setBulkAction={setBulkAction}
        setApplyTriggered={setApplyTriggered}
      />
    </>
  );
};

export default MediaPageContent;
