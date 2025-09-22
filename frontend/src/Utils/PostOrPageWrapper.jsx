import { useParams, useLocation } from 'react-router-dom';
import Page from './Page';
import { useEffect, useState } from 'react';
import { APIGetPostBy } from '../API/APIPosts';
import { getCurrentPost, setCurrentPost } from './PostStore';
import Loading from '../Admin/Components/Loading';

const PostOrPageWrapper = ({ theme, components }) => {
  const { post_name } = useParams();
  const location = useLocation();
  const [post, setPostState] = useState(getCurrentPost());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Skip API call for reserved paths that have their own dedicated routes
      const reservedPaths = ['login', 'sign-up'];
      if (reservedPaths.includes(post_name)) {
        setLoading(false);
        return;
      }

      // Skip API call for login page with forgotten password or reset password actions
      if (post_name === 'login' && location.search) {
        const searchParams = new URLSearchParams(location.search);
        const action = searchParams.get('action');
        if (action === 'forgottenPassword' || action === 'reset-password') {
          setLoading(false);
          return;
        }
      }

      const data = await APIGetPostBy('post_name', post_name);
      if (data.status === 200 && data.data.getPostBy) {
        setCurrentPost(data.data.getPostBy);
        setPostState(data.data.getPostBy);
      }
      setLoading(false);
    };
    fetchData();

    return () => {
      setCurrentPost(null);
    };
  }, [post_name, location.search]);

  if (loading) return <Loading />;

  if (!post) return <components.NotFound />;

  const isPage = !post?.post_type || post?.post_type === 'page';
  const Component = isPage ? Page : components.Post;

  return isPage ? (
    <Component PageContent={components.Page} post={post} theme={theme} />
  ) : (
    <Component post={post} />
  );
};

export default PostOrPageWrapper;
