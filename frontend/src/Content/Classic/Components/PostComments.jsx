import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '@/Contexts/UserContext';
import { format, formatDistanceToNow } from 'date-fns';
import { APIAddNewPostComment, APIGetPostComments } from '../../../API/APIPosts';
import { notify } from '../../../Utils/Notification';
import { Link } from 'react-router-dom';

const PostComments = ({ post }) => {
  const { user, LoginUser } = useContext(UserContext);
  const commentBoxRef = useRef(null);
  const [hideComments, setHideComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorParentId, setAuthorParentId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [comments, setComments] = useState([]);

  const formatCommentDate = (isoDate) => {
    const date = new Date(isoDate);

    const timePart = format(date, 'h:mm a');
    const datePart = format(date, 'do MMMM yyyy');
    const relativePart = formatDistanceToNow(date, { addSuffix: true });

    return `${timePart}, ${datePart}, ${capitalize(relativePart)}`;
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const adAddComment = async () => {
    if (newComment == '') {
      setShowWarning(true);
      return false;
    }
    const comment = {
      comment_author: user.id,
      comment_date: new Date().toISOString(),
      comment_date_gmt: new Date().toISOString(),
      comment_content: newComment,
      comment_approved: 't',
      comment_type: '',
      user_id: user.id,
    };
    if (authorParentId != null) {
      comment.comment_parent = authorParentId;
    }

    const data = await APIAddNewPostComment(post.id, comment);
    if (data.status == 200 && data.data.addNewPostComment.success == true) {
      fetchData();
      notify('Successfully added comment', 'success');
    } else {
      notify('Failed to add comment', 'error');
    }

    setNewComment('');
    setAuthorParentId(null);
  };

  const fetchData = async () => {
    const data = await APIGetPostComments(post.id);
    if (data.status == 200 && data.data.getPostComments.comments.length > 0) {
      setComments(data.data.getPostComments.comments);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const LoginSubmit = async () => {
    const result = await LoginUser(email, password);
    if (result === true) {
      window.location.reload();
    }
  };

  const CommentItem = ({ comment, comments, level = 0, setAuthorParentId }) => {
    const childComments = comments
      .filter((c) => c.comment_parent === comment.comment_id)
      .sort((a, b) => new Date(a.comment_date) - new Date(b.comment_date));

    return (
      <div style={{ marginLeft: `40px` }}>
        <div className="mb-8">
          <div className="bg-gray-200 flex flex-col rounded">
            <div
              className={`${
                user?.id == comment?.user_id ? 'bg-blue-800' : 'bg-gray-600'
              } text-white rounded-full mx-8 mt-[-20px] w-max pl-2 pr-6 py-1`}
            >
              <div className="flex flex-row items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  height="200px"
                  width="200px"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 rounded-full border-4 border-white p-1"
                >
                  <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                </svg>
                <p>{comment.comment_author_name}</p>
              </div>
            </div>
            <div className="mx-8 mt-4 flex items-center">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="200px"
                width="200px"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500 mr-2 w-4 h-4"
              >
                <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm14 226c0 7.7-6.3 14-14 14h-96c-7.7 0-14-6.3-14-14s6.3-14 14-14h82V128c0-7.7 6.3-14 14-14s14 6.3 14 14v146z"></path>
              </svg>
              <p className="text-gray-500">{formatCommentDate(comment.comment_date)}</p>
            </div>
            <div
              className={`bg-white border-l-8 ${
                user?.id == comment.user_id ? 'border-blue-800' : 'border-gray-600'
              } p-4 mx-8 my-4`}
            >
              {comment.comment_content}
            </div>
          </div>

          <div className="flex justify-end gap-4 text-sm">
            {/* <button className="text-red-700 hover:text-red-500">Report Comment</button> */}
            <button
              className="text-gray-600 hover:text-gray-400"
              onClick={() => {
                setAuthorParentId(comment.comment_id);
                setTimeout(() => {
                  commentBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
            >
              Reply
            </button>
          </div>
        </div>

        {childComments.map((child) => (
          <CommentItem
            key={child.comment_id}
            comment={child}
            comments={comments}
            level={level + 1}
            setAuthorParentId={setAuthorParentId}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <hr className="my-6" />
      <div className="flex flex-row items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold">Comments</h2>
        <button
          className="px-4 py-2 border border-gray-200 rounded"
          onClick={() => setHideComments((prev) => !prev)}
        >
          {hideComments ? 'Show' : 'Hide'} Comments
        </button>
      </div>
      {hideComments ? (
        ''
      ) : (
        <>
          {comments
            .filter((c) => c.comment_parent == null)
            .map((comment) => (
              <CommentItem
                key={comment.comment_id}
                comment={comment}
                comments={comments}
                setAuthorParentId={setAuthorParentId}
              />
            ))}
          <div className="w-full bg-gray-600 py-4 px-8 text-white rounded" ref={commentBoxRef}>
            {user?.id ? (
              <>
                <h2 className="font-bold mb-4">
                  {authorParentId != null ? 'Reply To ' : 'Add '} A Comment
                </h2>
                {authorParentId != null && (
                  <div className="mb-4 p-4 bg-gray-400 flex justify-between">
                    <p>
                      Reply to the comment left by{' '}
                      {comments.find((c) => c.comment_id == authorParentId).comment_author_name} at{' '}
                      {format(
                        new Date(comments.find((c) => c.comment_id == authorParentId).comment_date),
                        'dd/MM/yyyy - HH:mm',
                      )}
                      :
                    </p>
                    <button
                      className="text-white hover:text-gray-300"
                      onClick={() => {
                        setAuthorParentId(null);
                      }}
                    >
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
                )}
                <textarea
                  value={newComment}
                  onChange={(e) => {
                    if (e.target.value != '' && showWarning == true) {
                      setShowWarning(false);
                    }
                    setNewComment(e.target.value);
                  }}
                  rows={4}
                  className="w-full p-2 bg-gray-50 border rounded resize-y text-gray-800 mb-4"
                />
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 btn"
                  onClick={() => adAddComment()}
                >
                  Post Comment
                </button>
                {showWarning && (
                  <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 mt-4" role="alert">
                    <span class="font-medium">Error!</span> Cannot add a blank comment.
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="font-bold mb-4">Leave Comments</h2>
                <p className="mb-4">
                  In order to post comments you will need to Sign In or{' '}
                  <Link to="/" className="text-blue-300 hover:text-blue-500">
                    Sign Up
                  </Link>
                </p>
                <form
                  className={`flex flex-col lg:flex-row justify-center lg:items-center gap-4 mb-4`}
                  onSubmit={(e) => e.preventDefault()}
                  noValidate
                >
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    autoComplete="Current Email"
                    value={email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 w-full lg:w-1/2"
                    required=""
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    autoComplete="Current Password"
                    value={password}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 w-full lg:w-1/2"
                    required=""
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </form>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 btn"
                  onClick={(e) => LoginSubmit(e)}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostComments;
