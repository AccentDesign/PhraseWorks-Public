import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { APIConnectorContext } from '../../Contexts/APIConnectorContext';
import { APIGetFiles } from '../../API/APIMedia';
import MediaBoxView from './MediaBoxView';
import MediaSearch from './MediaSearch';
import MediaPagination from './MediaPagination';
import MediaAdd from './MediaAdd';

const SocialImage = ({ socialImage, setSocialImage, setImageId }) => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [sliderMediaOpen, setSliderMediaOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [thumbnail, setThumbnail] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [reloadMedia, setReloadMedia] = useState(false);
  const perPage = 20;

  const HandleClose = () => {};

  const fetchData = async () => {
    const data = await APIGetFiles(loginPassword, (page - 1) * perPage, type, search);
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

  useEffect(() => {
    fetchData();
  }, [page, type, search]);

  useEffect(() => {
    if (reloadMedia == true) {
      setReloadMedia(false);
      fetchData();
    }
  }, [reloadMedia]);

  useEffect(() => {
    if (socialImage != null) {
      const thumb =
        socialImage?.attachment_metadata?.sizes?.find((item) => item.slug === 'thumbnail')?.file ||
        socialImage?.filename;
      setThumbnail(thumb);
    }
  }, [socialImage]);
  return (
    <>
      <div className="mt-8">
        <h3 className="">Social Image</h3>
        {socialImage != '' && (
          <img
            src={`http://localhost/uploads/${thumbnail}`}
            className="w-[150px] h-[150px] object-cover"
            alt={socialImage?.post_title || socialImage?.filename}
          />
        )}

        <div className="flex flex-row justify-start">
          <button
            type="button"
            className="flex items-center justify-center  py-2 text-sm font-medium text-blue-700 hover:text-blue-800 "
            onClick={() => setSliderMediaOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Set Social Image
          </button>
        </div>
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
                                    setFeaturedImageId={setImageId}
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
    </>
  );
};

export default SocialImage;
