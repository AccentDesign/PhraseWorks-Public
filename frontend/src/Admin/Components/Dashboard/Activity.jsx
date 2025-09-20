import React from 'react';
import { useEffect } from 'react';
import { APIGetDashboardActivity } from '../../../API/APISystem';
import { useContext } from 'react';
import { APIConnectorContext } from '../../../Contexts/APIConnectorContext';
import { useState } from 'react';
import ScheduledPostRow from './ScheduledPostRow';

const Activity = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    const data = await APIGetDashboardActivity(loginPassword);
    if (data.status == 200 && data.data.getDashboardActivityData) {
      setPosts(data.data.getDashboardActivityData.posts);
      setTotal(data.data.getDashboardActivityData.total);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-item-block">
      <h3 className="font-bold text-lg">Activity</h3>
      <hr className="my-4" />
      <div className="flex items-center gap-1">
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="200px"
          width="200px"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          <path d="M256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8Zm92.49,313h0l-20,25a16,16,0,0,1-22.49,2.5h0l-67-49.72a40,40,0,0,1-15-31.23V112a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V256l58,42.5A16,16,0,0,1,348.49,321Z"></path>
        </svg>
        <p>Publishing Soon</p>
      </div>
      <div className="flex flex-wrap gap-y-4 mt-4">
        {total == 0 ? (
          <div
            className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 w-full"
            role="alert"
          >
            <svg
              className="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">No Posts Scheduled!</span> There are currently no posts
              scheduled for release.
            </div>
          </div>
        ) : (
          <table className="w-full">
            <tbody>
              {posts.map((post, idx) => (
                <ScheduledPostRow key={idx} post={post} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Activity;
