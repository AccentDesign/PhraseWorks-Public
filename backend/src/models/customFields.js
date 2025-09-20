import Media from './media.js';
import Post from './post.js';

export default class CustomFields {
  constructor() {}
  static async formatValue(fieldValue, fieldType, fieldData, connection, loaders) {
    if (
      fieldType == 'text' ||
      fieldType == 'text_area' ||
      fieldType == 'range' ||
      fieldType == 'number' ||
      fieldType == 'email' ||
      fieldType == 'url' ||
      fieldType == 'password'
    ) {
      return fieldValue;
    }
    if (fieldType == 'image') {
      const file = await Media.getFileById(fieldValue, connection);
      file.attachment_metadata = JSON.parse(file.attachment_metadata);
      if (fieldData.returnFormat == 'image_array') {
        return JSON.stringify(file);
      } else if (fieldData.returnFormat == 'image_url') {
        return `${window.location.origin.replace('5173', '8787')}/r2/${filename}`;
      } else {
        return fieldValue;
      }
    }
    if (fieldType == 'file') {
      const file = await Media.getFileById(fieldValue, connection);
      file.attachment_metadata = JSON.parse(file.attachment_metadata);
      if (fieldData.returnValue == 'file_array') {
        return JSON.stringify(file);
      } else if (fieldData.returnValue == 'file_url') {
        return `${window.location.origin.replace('5173', '8787')}/r2/${filename}`;
      } else {
        return fieldValue;
      }
    }
    if (fieldType == 'wysiwyg') {
      return JSON.stringify(fieldValue);
    }
    if (fieldType == 'link') {
      const post = await Post.getPostBy('id', fieldValue, connection, loaders);
      if (fieldData.linkReturnValue == 'link_array') {
        return JSON.stringify(post);
      } else {
        return `${window.location.origin.replace('5173', '8787')}/${post.post_name}`;
      }
    }
    if (fieldType == 'post') {
      if (fieldData.selectMultiple == false) {
        if (fieldData.postFormat == 'post_object') {
          const post = await Post.getPostBy('id', fieldValue, connection, loaders);
          return JSON.stringify(post);
        } else {
          return fieldValue;
        }
      }
    }
    if (fieldType == 'page_link') {
      if (fieldData.selectMultiple == false) {
        const post = await Post.getPostBy('id', fieldValue, connection, loaders);
        return JSON.stringify(post);
      }
    }
    if (fieldType == 'relationship') {
      const ids = JSON.parse(fieldValue);
      if (fieldData.postFormat == 'post_object') {
        const posts = await Promise.all(
          ids.map((id) => Post.getPostBy('id', id, connection, loaders)),
        );

        return JSON.stringify(posts);
      } else {
        return fieldValue;
      }
    }
  }
}
