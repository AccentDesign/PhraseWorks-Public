import { APIGetCategory, APIGetPostCategories, APIGetPostTags, APIPWQuery } from '../API/APIPosts';
import { APIGetPageTemplate } from '../API/APIPageTemplates';
import { parseContentWithShortcodes } from './Shortcodes/Shortcodes';
import { APILogError } from '../API/APISystem';

export const get_page_post = async (initialPost, post, setPost, setImageUrl) => {
  let p = post;
  if (initialPost && (!initialPost.categories || !initialPost.post_title)) {
    const data = await get_post();
    p = data;
    setPost(data);
  }
  const imageUrlTmp = await get_post_thumbnail(p, 'banner');
  setImageUrl(imageUrlTmp);
};

export const get_posts = async (page, perPage, type) => {
  const result = await PW_Query({
    post_type: type,
    paged: page,
    posts_per_page: perPage,
  });

  if (result?.data?.length > 0) {
    return result;
  }

  return null;
};

export const get_slug = () => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  const lastPart = segments.pop() || segments.pop();

  return lastPart;
};

export const get_post = async () => {
  const lastPart = get_slug();

  const result = await PW_Query({
    post_type: 'post',
    name: lastPart,
  });

  if (result.data.length > 0) {
    return result.data[0];
  }

  return null;
};

export const get_post_by = async (field, value) => {
  const queryArgs = {};

  queryArgs[field === 'id' ? 'p' : field] = value;

  const result = await PW_Query(queryArgs);
  if (result?.data?.length > 0) {
    return result.data[0];
  }

  return null;
};

export const get_posts_by_author = async (page, perPage, id) => {
  if (!id) return [];

  const result = await PW_Query({
    post_type: 'post',
    author: Number(id),
    paged: page,
    posts_per_page: perPage,
  });

  if (result?.data?.length > 0) {
    return result;
  }
  return null;
};

export const get_posts_by_category = async (page, perPage, category) => {
  const result = await PW_Query({
    post_type: 'post',
    cat: Number(category),
    paged: page,
    posts_per_page: perPage,
  });

  if (result?.data?.length > 0) {
    return result;
  }
  return null;
};

export const get_content = (post, shortcodes, context = {}) => {
  if (!post || !post.post_content) return '';
  return parseContentWithShortcodes(post.post_content, shortcodes, context);
};

export const get_post_thumbnail = async (post, size) => {
  if (!post || !post.featured_image_metadata) return '';

  let origin = window.location.origin.replace(':5173', '');
  if (size == '') {
    const data = JSON.parse(post.featured_image_imagedata);
    if (data?.guid) {
      return `${origin}/uploads/${data.guid}`;
    }
  }

  const meta = JSON.parse(post.featured_image_metadata);

  let imageUrl = '';

  if (meta?.sizes) {
    const entry = meta.sizes.find((sizeEntry) => sizeEntry.slug === size);
    if (entry) {
      imageUrl = `${origin}/uploads/${entry.file}`;
    }
  }

  if (!imageUrl && meta?.file) {
    imageUrl = `${origin}/uploads/${meta.file}`;
  }

  if (imageUrl) {
    try {
      const res = await fetch(imageUrl, { method: 'HEAD' });

      if (res.ok) {
        return imageUrl;
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      return null;
    }
  }

  return false;
};

export const get_post_image_alt_tag = (post) => {
  if (!post || !post.featured_image_imagedata) return '';
  const meta = JSON.parse(post.featured_image_imagedata);
  if (meta) {
    return meta.alt;
  }
};

export const get_post_categories = async (postId) => {
  const data = await APIGetPostCategories(postId);
  if (data.status == 200) {
    if (data.data.getPostCategories?.categories) {
      return data.data.getPostCategories?.categories;
    } else {
      return [];
    }
  }
  return null;
};

export const get_post_tags = async (postId) => {
  const data = await APIGetPostTags(postId);
  if (data.status == 200) {
    if (data.data.getPostTags?.tags) {
      return data.data.getPostTags?.tags;
    } else {
      return [];
    }
  }
  return null;
};

export const get_page_template = async () => {
  const path = window.location.pathname; // e.g., "/blog/post/123"
  const segments = path.split('/').filter(Boolean);

  const lastPart = segments.pop() || segments.pop();
  const data = await APIGetPageTemplate(lastPart);
  if (data.data != null) {
    return data.data.getPageTemplate;
  }
  return null;
};

export const get_post_excerpt = (post, wordLimit = 30) => {
  if (!post.post_content) return '';
  const noShortcodes = post.post_content.replace(/\[.*?\]/g, ' ');
  // Strip HTML tags
  const plainText = noShortcodes
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Limit to `wordLimit` words
  const words = plainText.split(' ');
  if (words.length <= wordLimit) return plainText;

  return words.slice(0, wordLimit).join(' ') + '...';
};

export const get_post_excerpt_html = (post, wordLimit = 30) => {
  if (!post.post_content) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(post.post_content, 'text/html');

  let wordCount = 0;
  const fragment = document.createDocumentFragment();

  const processNode = (node, parentFragment) => {
    if (wordCount >= wordLimit) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.trim().split(/\s+/);
      if (words.length === 0) return;

      const remainingWords = wordLimit - wordCount;
      const wordsToUse = words.slice(0, remainingWords);
      wordCount += wordsToUse.length;

      const newTextNode = document.createTextNode(
        wordsToUse.join(' ') + (wordCount === wordLimit ? '...' : ''),
      );
      parentFragment.appendChild(newTextNode);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clonedNode = node.cloneNode(false);
      parentFragment.appendChild(clonedNode);

      for (const child of node.childNodes) {
        processNode(child, clonedNode);
        if (wordCount >= wordLimit) break;
      }
    }
  };

  for (const child of doc.body.childNodes) {
    processNode(child, fragment);
    if (wordCount >= wordLimit) break;
  }

  const tempDiv = document.createElement('div');
  tempDiv.appendChild(fragment);
  return tempDiv.innerHTML;
};

export const get_category = async (categoryName) => {
  const data = await APIGetCategory(categoryName);
  if (data.data != null) {
    return data.data.getCategory;
  }
};

const allowedParams = new Set([
  'p',
  'name',
  'title',
  'page_id',
  'pagename',
  'pagename__in',
  'post_parent',
  'post_parent__in',
  'post_parent__not_in',
  'post__in',
  'post__not_in',
  'post_name__in',
  'author',
  'author_name',
  'post_type',
  'post_status',
  'cat',
  'category_name',
  'category__and',
  'category__in',
  'category__not_in',
  'comment_count',
  'tag',
  'tag_id',
  'tag__and',
  'tag__in',
  'tag__not_in',
  'tag_slug__and',
  'tag_slug__in',
  'tax_query',
  's',
  'exact',
  'sentence',
  'has_password',
  'post_password',
  'fields',
  'meta_key',
  'meta_value',
  'meta_value_num',
  'meta_compare',
  'meta_query',
  'year',
  'monthnum',
  'w',
  'day',
  'hour',
  'minute',
  'second',
  'm',
  'date_query',
  'posts_per_page',
  'nopaging',
  'paged',
  'offset',
  'posts_per_archive_page',
  'orderby',
  'order',
  'ignore_sticky_posts',
  'cache_results',
  'update_post_meta_cache',
  'update_post_term_cache',
  'lazy_load_term_meta',
  'perm',
  'post_mime_type',
]);

export const PW_Query = async (args, loginPassword = null) => {
  const sanitizedArgs = {};
  const invalidKeys = [];

  for (const key in args) {
    if (allowedParams.has(key)) {
      sanitizedArgs[key] = args[key];
    } else {
      invalidKeys.push(key);
    }
  }

  if (invalidKeys.length > 0) {
    throw new Error(`PW_Query does not allow these args: ${invalidKeys.join(', ')}`);
  }

  let data = [];
  let total = 0;
  if (invalidKeys.length == 0) {
    const tmpData = await APIPWQuery(sanitizedArgs, loginPassword);
    if (tmpData.status == 200 && tmpData.data.getPWQuery) {
      data = tmpData.data.getPWQuery.posts;
      total = tmpData.data.getPWQuery.total;
    }
  }

  return {
    sanitizedArgs,
    invalidKeys,
    data: data,
    total: total,
  };
};
