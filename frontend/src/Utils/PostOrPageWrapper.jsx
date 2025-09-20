import { useParams } from 'react-router-dom';
import Page from './Page';
import { useEffect, useState } from 'react';
import { APIGetPostBy } from '../API/APIPosts';
import { getCurrentPost, setCurrentPost } from './PostStore';
import Loading from '../Admin/Components/Loading';

const PostOrPageWrapper = ({ theme, components }) => {
  const { post_name } = useParams();
  const [post, setPostState] = useState(getCurrentPost());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
  }, [post_name]);

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
