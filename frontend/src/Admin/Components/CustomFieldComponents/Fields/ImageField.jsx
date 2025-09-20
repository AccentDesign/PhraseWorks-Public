import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import MediaSearch from './MediaSearch';
import MediaAdd from './MediaAdd';
import MediaBoxView from './MediaBoxView';
import MediaPagination from './MediaPagination';
import { APIGetFileById, APIGetFiles } from '../../../../API/APIMedia';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';

const ImageField = ({ type, value, setValue, label, name, defaultValue, args }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [sliderMediaOpen, setSliderMediaOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [filename, setFileName] = useState('');
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
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, 'image', search);
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
          <p>No image selected</p>
        ) : (
          <div className="flex flex-col items-center w-[150px]">
            <img src={url} className="w-[150px] h-[150px] object-cover" alt="image_preview" />
            <p className="text-center">{filename}</p>
          </div>
        )}
        <button type="button" className="secondary-btn" onClick={() => showImageSelections()}>
          {url == '' ? 'Add' : 'Update'} Image
        </button>
        {url == '' ? (
          ''
        ) : (
          <button type="button" className="secondary-btn" onClick={() => removeSelectedFile()}>
            Remove Image
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

export default ImageField;
