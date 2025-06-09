import {
  APIAllGetPostsByType,
  APIGetCategory,
  APIGetPostBy,
  APIGetPostCategories,
  APIGetPostsByAuthor,
  APIGetPostsByCategory,
  APIGetPostTags,
} from '../API/APIPosts';
import { APIGetPageTemplate } from '../API/APIPageTemplates';
import parse from 'html-react-parser';

export const get_posts = async (page, perPage, type) => {
  const data = await APIAllGetPostsByType(page, perPage, type);
  if (data.status == 200) {
    return data.data.getPostsByType;
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
  const data = await get_post_by('post_name', lastPart);
  if (data != null) {
    return data;
  }
  return null;
};

export const get_post_by = async (field, value) => {
  const data = await APIGetPostBy(field, value);
  if (data.status == 200) {
    return data.data.getPostBy;
  }
  return null;
};

export const get_posts_by_author = async (page, perPage, id) => {
  const data = await APIGetPostsByAuthor(page, perPage, 'post', id);
  if (data.status == 200) {
    return data.data.getPostsByAuthor;
  }
  return null;
};

export const get_posts_by_category = async (page, perPage, category) => {
  const data = await APIGetPostsByCategory(page, perPage, category);
  if (data.status == 200) {
    return data.data?.getPostsByCategory;
  }
  return null;
};

export const get_content = (post) => {
  if (post) {
    return parse(post.post_content);
  }
  return '';
};

export const get_post_thumbnail = (post, size) => {
  if (post) {
    const meta = JSON.parse(post.featured_image_metadata);
    if (meta) {
      const entry = meta.sizes.filter((sizeEntry) => sizeEntry.slug == size);

      const origin = window.location.origin;
      if (entry.length > 0) {
        return `${origin.replace('5173', '8787')}/r2/${entry[0].file}`;
      }
      return `${origin.replace('5173', '8787')}/r2/${meta.file}`;
    }
  }
  return '';
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

  // Strip HTML tags
  const plainText = post.post_content
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
