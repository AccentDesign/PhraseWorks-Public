/*
s3 Uploads Plugin - Backend
*/

import resolvers from './resolvers.js';
import typeDefs from './schema.js';
import { addAction, removeAction } from '../../utils/actionBus.js';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  getAllItems,
  getS3Client,
  getContentTypeByExtension,
  uploadFile,
  getSettings,
  deleteFile,
  getS3Env,
} from './functions.js';

let initialized = false;
let getFilesCallback,
  getFileCallback,
  getFileUploadCallback,
  deleteFileCallback,
  deleteFilesCallback,
  getAdminMenusCallback,
  getAdminPagesCallback;

export function init() {
  if (initialized) return;

  getFilesCallback = async (folder, type, search, offset, env, connection) => {
    const s3Env = await getS3Env(connection);
    if (s3Env == false) {
      return;
    }

    const s3Client = getS3Client(s3Env);
    const allFiles = await getAllItems(s3Client, s3Env.bucketName);
    const files = allFiles.objects.reduce((acc, obj) => {
      const key = obj.Key.toLowerCase();
      if (
        key.includes('-thumbnail.') ||
        key.includes('-large.') ||
        key.includes('-medium.') ||
        key.includes('-banner.')
      ) {
        return acc; // skip
      }
      acc.push({
        id: obj.Key,
        key: obj.Key,
        size: obj.Size,
        contentType: obj.ContentType || 'unknown',
        lastModified: obj.LastModified,
        url: `http://localhost/r2/${obj.Key}`,
      });
      return acc;
    }, []);
    const folders = allFiles.delimitedPrefixes || [];
    const result = {
      files,
      folders,
    };

    return result;
  };

  getFileCallback = async (key, env, c, connection) => {
    const s3Env = await getS3Env(connection);
    if (s3Env == false) {
      return;
    }

    const s3Client = getS3Client(s3Env);
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
        }),
      );
    } catch (err) {
      if (err.name === 'NotFound' || err.Code === 'NoSuchKey') {
        return c.json({ error: 'File not found' }, 404);
      } else {
        return c.json({ error: 'Internal error' }, 500);
      }
    }

    try {
      const file = await s3Client.send(
        new GetObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: key,
        }),
      );
      if (!file.Body) throw new Error('File not found');

      const headers = new Headers();
      headers.append('etag', file.ETag || '');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      headers.set('Content-Type', file.ContentType || 'image/svg+xml');

      return new Response(file.Body, {
        headers,
      });
    } catch (err) {
      console.error('Error fetching file:', err);
      return c.json({ error: 'File not found' }, 404);
    }
  };

  getFileUploadCallback = async (
    filePath,
    key,
    base64,
    width,
    height,
    type,
    size,
    url,
    safeFilename,
    env,
    connection,
    userId,
  ) => {
    const s3Env = await getS3Env(connection);
    if (s3Env == false) {
      return;
    }

    const binary = Buffer.from(base64, 'base64');
    const s3Client = getS3Client(s3Env);
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: s3Env.bucketName,
          Key: safeFilename,
        }),
      );

      const dotIndex = safeFilename.lastIndexOf('.');
      const base = dotIndex !== -1 ? safeFilename.slice(0, dotIndex) : safeFilename;
      const ext = dotIndex !== -1 ? safeFilename.slice(dotIndex) : '';
      const uuid = crypto.randomUUID();
      safeFilename = `${base}_${uuid}${ext}`;
      key = safeFilename;
    } catch (err) {
      if (err.$metadata && err.$metadata.httpStatusCode !== 404) {
        throw err;
      }
    }

    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Env.bucketName,
        Key: safeFilename,
        Body: binary,
        ContentType: getContentTypeByExtension(safeFilename),
        ACL: 'public-read',
      }),
    );

    const fileObj = {
      filename: safeFilename,
      type,
      data: base64,
      size,
    };

    await uploadFile(
      safeFilename,
      fileObj,
      width,
      height,
      s3Client,
      connection,
      userId,
      url,
      s3Env,
    );

    return { success: true };
  };

  deleteFileCallback = async (filepath, env, connection) => {
    const s3Env = await getS3Env(connection);
    if (s3Env == false) {
      return;
    }

    const settings = await getSettings(connection);
    const settingsObjects = JSON.parse(settings.option_value);

    const s3Client = getS3Client(s3Env);
    try {
      const deleteResult = await deleteFile(filepath, s3Env, connection, s3Client, settingsObjects);
      return { success: true, msg: `Deleted (or did not exist): ${filepath}` };
    } catch (err) {
      throw new Error(`Failed to delete file: ${err.message}`);
    }
  };

  deleteFilesCallback = async (ids, env, connection) => {
    const s3Env = await getS3Env(connection);
    if (s3Env == false) {
      return;
    }

    const s3Client = getS3Client(s3Env);
    const settings = await getSettings(connection);
    const settingsObjects = JSON.parse(settings.option_value);

    try {
      for (const filepath of ids) {
        await deleteFile(filepath, s3Env, connection, s3Client, settingsObjects);
      }

      return { success: true, msg: `Deleted (or did not exist): ${ids.join(', ')}` };
    } catch (err) {
      console.error('Failed to delete files:', err);
      throw new Error(`Failed to delete files: ${err.message}`);
    }
  };

  getAdminMenusCallback = async (menu) => {
    const settingsMenu = menu.find((item) => item.id === 'settings');
    const exists = settingsMenu.children.some((item) => item.id === 'plugin-s3-uploads-plugin');

    if (!exists) {
      settingsMenu.children.push({
        id: 'plugin-s3-uploads-plugin',
        name: 'S3 Uploads Plugin',
        slug: '/admin/settings/s3UploadsPlugin',
        icon: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4"><path d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2C297 398 352 333.4 352 256l0-32c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160z"></path></svg>',
        order: 2,
        children: [],
      });
    }
    return menu;
  };

  getAdminPagesCallback = async (adminPages) => {
    const settingsPage = adminPages.find((item) => item.key === 'admin-settings');
    if (!settingsPage) {
      return adminPages;
    }

    // Does it already exist in settings children?
    const exists = settingsPage.children.some(
      (item) => item.key === 'plugin-s3-uploads-plugin-page',
    );

    if (!exists) {
      settingsPage.children.push({
        key: 'plugin-s3-uploads-plugin-page',
        path: 's3UploadsPlugin', // relative to settings/*
        index: true,
        core: false,
        element: 'PluginS3UploadsPluginPage',
        elementLocation: 's3UploadsPlugin/Pages',
      });
    }

    return adminPages;
  };
  addAction('get_files', 's3UploadsPlugin', getFilesCallback);
  addAction('get_file', 's3UploadsPlugin', getFileCallback);
  addAction('upload_file', 's3UploadsPlugin', getFileUploadCallback);
  addAction('delete_file', 's3UploadsPlugin', deleteFileCallback);
  addAction('delete_files', 's3UploadsPlugin', deleteFilesCallback);
  addAction('get_admin_menus', 's3UploadsPlugin', getAdminMenusCallback);
  addAction('get_admin_pages', 's3UploadsPlugin', getAdminPagesCallback);

  initialized = true;
}

export function disable() {
  removeAction('get_files', 's3UploadsPlugin', getFilesCallback);
  removeAction('get_file', 's3UploadsPlugin', getFileCallback);
  removeAction('upload_file', 's3UploadsPlugin', getFileUploadCallback);
  removeAction('delete_file', 's3UploadsPlugin', deleteFileCallback);
  removeAction('delete_files', 's3UploadsPlugin', deleteFilesCallback);
  removeAction('get_admin_menus', 's3UploadsPlugin', getAdminMenusCallback);
  removeAction('get_admin_pages', 's3UploadsPlugin', getAdminPagesCallback);

  initialized = false;
}

export default {
  version: '1.0.0',
  name: 'S3 Uploads Plugin',
  slug: 's3UploadsPlugin',
  description: 'A plugin for utilising S3 or R2 bucket for file uploads and content.',
  author: 'Nick Thompson, Accent Design Ltd',
  authorUrl: 'https://www.accentdesign.co.uk',
  resolvers,
  typeDefs,
  init: init,
  disable: disable,
  shortCodes: [],
};
