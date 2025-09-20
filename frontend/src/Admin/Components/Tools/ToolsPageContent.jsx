import { Link } from 'react-router-dom';
import TitleBar from './Dashboard/TitleBar';

const ToolsPageContent = () => {
  return (
    <>
      <div className="w-full">
        <TitleBar />
        <div className="mt-8 mt-8">
          <Link
            to="/admin/tools/cron"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Cron Events
            </h5>
            <p className="font-normal text-gray-700">
              Manage the sites Cron Events
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ToolsPageContent;
