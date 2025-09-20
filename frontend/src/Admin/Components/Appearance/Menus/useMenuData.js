import { useState, useCallback, useContext } from 'react';
import { APIGetCustomPosts } from '../../../../API/APICustomPosts';
import { APIGetPosts, APIAllGetPostsSearch } from '../../../../API/APIPosts';
import { APIGetMenus, APIUpdateMenus } from '../../../../API/APISystem';
import { APIConnectorContext } from '../../../../Contexts/APIConnectorContext';
import { notify } from '../../../../Utils/Notification';

export const useMenuData = () => {
  const { loginPassword } = useContext(APIConnectorContext);
  const [availableItems, setAvailableItems] = useState([]);
  const [menus, setMenus] = useState([]);

  const normalizePostTypeName = (name) => {
    return name
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const fetchData = useCallback(async (isMounted = true) => {
    const customPostsDb = await APIGetCustomPosts(loginPassword);
    let customPosts = [];
    if (isMounted && customPostsDb.status == 200 && customPostsDb.data.getCustomPosts) {
      customPosts = JSON.parse(customPostsDb.data.getCustomPosts);
    }

    let pages = [];
    let posts = [];

    const pagesData = await APIGetPosts(loginPassword, 1, 4, 'page');
    if (isMounted && pagesData.status == 200) {
      pages = pagesData.data.getPosts.posts;
    }
    const postsData = await APIGetPosts(loginPassword, 1, 4, 'post');
    if (isMounted && postsData.status == 200) {
      posts = postsData.data.getPosts.posts;
    }

    const customPostItems = await Promise.all(
      customPosts.map(async (postType) => {
        const slug = normalizePostTypeName(postType.name);
        const response = await APIGetPosts(loginPassword, 1, 4, slug);
        let items = [];
        if (isMounted && response.status === 200) {
          items = response.data.getPosts.posts.map((p) => ({
            id: `${slug}-${p.id}`,
            title: p.post_title,
            url: `/${p.post_name}`,
            type: slug,
            postId: p.id,
          }));
        }
        return {
          type: postType.name,
          items,
        };
      }),
    );

    const tmpItems = [
      {
        type: 'Pages',
        items: pages.map((page) => ({
          id: `page-${page.id}`,
          title: page.post_title,
          url: `/${page.post_name}`,
          type: 'page',
          postId: page.id,
        })),
      },
      {
        type: 'Posts',
        items: posts.map((post) => ({
          id: `post-${post.id}`,
          title: post.post_title,
          url: `/${post.post_name}`,
          type: 'post',
          postId: post.id,
        })),
      },
      ...customPostItems,
      {
        type: 'Custom Links',
        items: [{ id: 'custom', title: 'Custom', url: '/', type: 'custom' }],
      },
    ];
    setAvailableItems(tmpItems);

    const menusData = await APIGetMenus(loginPassword);
    if (isMounted && menusData.status == 200) {
      setMenus(JSON.parse(menusData.data.getMenus));
    }
  }, [loginPassword]);

  const searchItems = async (type, value) => {
    let results = [];

    let postType = 'post';

    if (type === 'Pages' || type === 'Posts') {
      postType = type === 'Pages' ? 'page' : 'post';
    } else {
      postType = normalizePostTypeName(type);
    }

    if (value != '') {
      const response = await APIAllGetPostsSearch(loginPassword, value, 1, 6, postType);

      if (response.status === 200) {
        results = response.data.getPostsSearch.posts.map((item) => ({
          id: `${postType}-${item.id}`,
          title: item.post_title,
          url: `/${item.post_name}`,
          type: postType,
          postId: item.id,
        }));
      }
    } else {
      const response = await APIGetPosts(loginPassword, 1, 4, postType);
      if (response.status === 200) {
        results = response.data.getPosts.posts.map((item) => ({
          id: `${postType}-${item.id}`,
          title: item.post_title,
          url: `/${item.post_name}`,
          type: postType,
          postId: item.id,
        }));
      }
    }

    setAvailableItems((prevItems) =>
      prevItems.map((section) =>
        section.type === type ? { ...section, items: results } : section,
      ),
    );
  };

  const saveMenu = async (name, menuItems, menus) => {
    const newMenu = { name, menuData: menuItems };

    const updatedMenus = [...menus];
    const existingIndex = updatedMenus.findIndex((m) => m.name === name);
    if (existingIndex !== -1) {
      updatedMenus[existingIndex] = newMenu;
    } else {
      updatedMenus.push(newMenu);
    }
    const data = await APIUpdateMenus(loginPassword, updatedMenus);
    if (data.status == 200) {
      if (data.data.updateMenus.success) {
        notify('Successfully updated menus.', 'success');
        await fetchData();
      } else {
        notify('Failed to update menus.', 'error');
      }
    } else {
      notify('Failed to update menus.', 'error');
    }
  };

  return {
    availableItems,
    menus,
    fetchData,
    searchItems,
    saveMenu
  };
};