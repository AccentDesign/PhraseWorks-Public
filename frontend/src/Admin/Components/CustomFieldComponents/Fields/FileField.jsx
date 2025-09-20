import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import MediaSearch from './MediaSearch';
import MediaAdd from './MediaAdd';
import MediaBoxView from './MediaBoxView';
import MediaPagination from './MediaPagination';
import { APIGetFileById, APIGetFiles } from '../../../../API/APIMedia';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';

const FileField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [sliderMediaOpen, setSliderMediaOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [filename, setFileName] = useState('');
  const [ext, setExt] = useState('');
  const [reloadMedia, setReloadMedia] = useState(false);
  const [search, setSearch] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const perPage = 20;

  const HandleClose = () => {};
  const showImageSelections = () => {
    setSliderMediaOpen(true);
  };

  const setSelectedFile = (file) => {
    const syntheticEvent = {
      target: {
        value: file.id,
      },
    };
    setValue(syntheticEvent);
    setUrl(file.url);
    setFileName(file.filename);
    setExt(file.filename.split('.').pop().toLowerCase());
  };

  const removeSelectedFile = () => {
    const syntheticEvent = {
      target: {
        value: '',
      },
    };
    setValue(syntheticEvent);
    setUrl('');
  };

  const fetchData = async () => {
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, 'not_image', search);
    if (data.status == 200) {
      const tmpFiles = [];
      setTotalFiles(data.data.getMediaFiles.total);
      data.data.getMediaFiles.files.map((file) => {
        const url = `http://localhost/uploads/${file.filename}`;
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

  const fetchById = async () => {
    const data = await APIGetFileById(value);
    if (data.status == 200) {
      const file = data.data.getMediaFileById;
      const urlTmp = `http://localhost/uploads/${file.filename}`;
      setUrl(urlTmp);
      setFileName(file.filename);
      setExt(file.filename.split('.').pop().toLowerCase());
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  useEffect(() => {
    if (reloadMedia == true) {
      setReloadMedia(false);
      fetchData();
    }
  }, [reloadMedia]);

  useEffect(() => {
    if (value != '') {
      fetchById();
    }
  }, [value]);

  return (
    <div className="w-full mb-4">
      <div className="flex flex-row items-center gap-4">
        {url == '' ? (
          <p>No file selected</p>
        ) : (
          <div className="flex flex-col items-center w-[150px]">
            {ext == 'csv' ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[150px] h-[150px] text-gray-200"
              >
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-96 144c0 4.42-3.58 8-8 8h-8c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h8c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-8c-26.51 0-48-21.49-48-48v-32c0-26.51 21.49-48 48-48h8c4.42 0 8 3.58 8 8v16zm44.27 104H160c-4.42 0-8-3.58-8-8v-16c0-4.42 3.58-8 8-8h12.27c5.95 0 10.41-3.5 10.41-6.62 0-1.3-.75-2.66-2.12-3.84l-21.89-18.77c-8.47-7.22-13.33-17.48-13.33-28.14 0-21.3 19.02-38.62 42.41-38.62H200c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8h-12.27c-5.95 0-10.41 3.5-10.41 6.62 0 1.3.75 2.66 2.12 3.84l21.89 18.77c8.47 7.22 13.33 17.48 13.33 28.14.01 21.29-19 38.62-42.39 38.62zM256 264v20.8c0 20.27 5.7 40.17 16 56.88 10.3-16.7 16-36.61 16-56.88V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v20.8c0 35.48-12.88 68.89-36.28 94.09-3.02 3.25-7.27 5.11-11.72 5.11s-8.7-1.86-11.72-5.11c-23.4-25.2-36.28-58.61-36.28-94.09V264c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8zm121-159L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path>
              </svg>
            ) : ext == 'docx' || ext == 'doc' ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[150px] h-[150px] text-gray-200"
              >
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H305c7.7 0 13.4 7.1 11.7 14.7l-38 168c-1.2 5.5-6.1 9.3-11.7 9.3h-38c-5.5 0-10.3-3.8-11.6-9.1-25.8-103.5-20.8-81.2-25.6-110.5h-.5c-1.1 14.3-2.4 17.4-25.6 110.5-1.3 5.3-6.1 9.1-11.6 9.1H117c-5.6 0-10.5-3.9-11.7-9.4l-37.8-168c-1.7-7.5 4-14.6 11.7-14.6h24.5c5.7 0 10.7 4 11.8 9.7 15.6 78 20.1 109.5 21 122.2 1.6-10.2 7.3-32.7 29.4-122.7 1.3-5.4 6.1-9.1 11.7-9.1h29.1c5.6 0 10.4 3.8 11.7 9.2 24 100.4 28.8 124 29.6 129.4-.2-11.2-2.6-17.8 21.6-129.2 1-5.6 5.9-9.5 11.5-9.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
              </svg>
            ) : ext == 'xlsx' || ext == 'xls' ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[150px] h-[150px] text-gray-200"
              >
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
              </svg>
            ) : ext == 'pdf' ? (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[150px] h-[150px] text-gray-200"
              >
                <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path>
              </svg>
            ) : (
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[150px] h-[150px] text-gray-200"
              >
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
              </svg>
            )}
            <p className="text-center">{filename}</p>
          </div>
        )}
        <button type="button" className="secondary-btn" onClick={() => showImageSelections()}>
          {url == '' ? 'Add' : 'Update'} File
        </button>
        {url == '' ? (
          ''
        ) : (
          <button type="button" className="secondary-btn" onClick={() => removeSelectedFile()}>
            Remove File
          </button>
        )}
      </div>
      <Transition.Root show={sliderMediaOpen} as={Fragment}>
        <Dialog as="div" className="slide-panel" onClose={HandleClose}>
          <div className="fixed inset-0" />

          <div className="slide-panel-content-wrapper">
            <div className="slide-panel-content">
              <div className="slide-panel-content-inner">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-7xl">
                    <div
                      className={`bg-gray-100 flex h-full flex-col overflow-y-scroll  py-6 shadow-2xl`}
                    >
                      <div className="px-4 sm:px-6">
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          <div className="flex items-start justify-start">
                            <div className="w-full">
                              <div className="flex items-start justify-between w-full pt-3">
                                <Dialog.Title
                                  className={`text-gray-900 text-base font-semibold leading-6`}
                                >
                                  Media
                                </Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                  <button
                                    type="button"
                                    className={`relative rounded-md text-gray-400 hover:text-gray-500`}
                                    onClick={() => {
                                      setSliderMediaOpen(false);
                                    }}
                                  >
                                    <span className="absolute -inset-2.5" />
                                    <span className="sr-only">Close panel</span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth="1.5"
                                      stroke="currentColor"
                                      className="h-6 w-6"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="mt-4">
                                <MediaSearch search={search} setSearch={setSearch} />
                                <MediaAdd
                                  reloadMedia={reloadMedia}
                                  setReloadMedia={setReloadMedia}
                                />
                                <div className="panel mt-8">
                                  <MediaBoxView
                                    files={files}
                                    setSelectedFile={setSelectedFile}
                                    setSliderMediaOpen={setSliderMediaOpen}
                                  />
                                  <MediaPagination
                                    totalFiles={totalFiles}
                                    page={page}
                                    perPage={perPage}
                                    setPage={setPage}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default FileField;
