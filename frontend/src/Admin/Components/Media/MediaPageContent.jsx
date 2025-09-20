import React, { useContext, useEffect, useRef, useState } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext.jsx';
import {
  APIGetFile,
  APISendUpload,
  APIUploadFile,
  APIGetFiles,
  APIDeleteFiles,
  APIDeleteFile,
  APIReplaceFile,
  APIReplaceFileWithSetting,
} from '../../../API/APIMedia.js';
import TitleBar from './MediaPage/TitleBar.jsx';
import SearchBar from './MediaPage/SearchBar.jsx';
import ActionsButton from './MediaPage/ActionsButton.jsx';
import ListView from './MediaPage/ListView.jsx';
import BoxView from './MediaPage/BoxView.jsx';
import Pagination from './MediaPage/Pagination.jsx';
import Upload from './MediaPage/Upload.jsx';
import Detail from './MediaPage/Detail.jsx';
import { notify } from '../../../Utils/Notification.jsx';
import { APILogError } from '../../../API/APISystem.js';

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
  const [editFile, setEditFile] = useState(false);

  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderDetailsOpen, setSliderDetailsOpen] = useState(false);
  const [applyTriggered, setApplyTriggered] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [reloadFiles, setReloadFiles] = useState(true);
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

  const deleteFile = async (filename) => {
    try {
      const result = await APIDeleteFile(loginPassword, filename);
      if (result.status === 200 && result.data.deleteFile) {
        setDetailsId(null);
        fetchData();
        setSliderDetailsOpen(false);
        notify('File deleted', 'success');
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Delete failed:', err);
    }
  };

  const SendData = async () => {
    const inputFiles = fileInputRef.current.files;
    if (!inputFiles.length) return;
    const file = fileInputRef.current.files[0];
    if (!file) {
      notify('Please select a file.', 'error');
      return;
    }

    try {
      const result = await APIUploadFile(loginPassword, file);
      if (result.status === 200 && result.data.uploadFile) {
        notify('File uploaded', 'success');
        const key = file.name;
        let safeFilename = key.replace(/[^a-zA-Z0-9._-]/g, '_');
        const imgBlob = await APIGetFile(safeFilename);

        const url = URL.createObjectURL(imgBlob);
        setImgUrl(url);
        setPage(1);
        fetchData();
        fileInputRef.current.value = '';
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Upload or fetch failed:', err);
    }
  };

  const replaceFile = async (id, filename, file, selectedSetting) => {
    if (!file) {
      notify('Please select a file.', 'error');
      return;
    }
    const croppedFile = file;
    const result = await APIReplaceFileWithSetting(loginPassword, id, croppedFile, selectedSetting);

    if (result.status === 200 && result.data.replaceFileWithSetting) {
      notify('File uploaded', 'success');
      setEditFile(false);
      setPage(1);
      setSliderDetailsOpen(false);
      fetchData();
    }
  };

  const fetchData = async () => {
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, type, search);
    if (data.status == 200) {
      const tmpFiles = [];
      setTotalFiles(data.data.getMediaFiles.total);
      data.data.getMediaFiles.files.map((file) => {
        const url = `http://localhost/uploads/${file.filename}`;
        const newData = {
          id: file.id ? file.id : crypto.randomUUID(),
          filename: file.filename,
          mimetype: file.mimetype,
          url: url,
          author: file.author,
          date: file.date,
          attachment_metadata: JSON.parse(file.attachment_metadata),
          metadata: file?.metadata ? JSON.parse(file.metadata) : {},
        };
        tmpFiles.push(newData);
      });
      setFiles(tmpFiles);
      setReloadFiles(true);
    }
  };

  useEffect(() => {
    if (applyTriggered && bulkAction === 'delete') {
      handleApply();
      setApplyTriggered(false);
    }
  }, [bulkAction, applyTriggered]);

  useEffect(() => {
    fetchData();
  }, [page, type, search]);

  return (
    <>
      <div className="w-full">
        <TitleBar setSliderOpen={setSliderOpen} />
        {previewImage && (
          <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />
        )}
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

        <div className="panel mt-8 mt-8">
          {view == 'list' ? (
            <ListView
              files={files}
              selectedIds={selectedIds}
              toggleCheckbox={toggleCheckbox}
              ShowDetails={ShowDetails}
              reloadFiles={reloadFiles}
              setReloadFiles={setReloadFiles}
            />
          ) : (
            <BoxView
              files={files}
              ShowDetails={ShowDetails}
              reloadFiles={reloadFiles}
              setReloadFiles={setReloadFiles}
            />
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
        deleteFile={deleteFile}
        editFile={editFile}
        setEditFile={setEditFile}
        replaceFile={replaceFile}
      />
    </>
  );
};

export default MediaPageContent;
