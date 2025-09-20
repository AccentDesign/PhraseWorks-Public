import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { get_site_title, get_url } from '../Includes/Functions';
import { APIGetPostSEO } from '../API/APIPosts';
import { APIGetSiteSEOSettings, APILogError } from '../API/APISystem';
import { APIGetFileById } from '../API/APIMedia';
import { getWebSocket } from '../Includes/WebSocketClient';

const SITE_TITLE_CACHE_KEY = 'app:siteTitle';

const HeadMeta = ({ description, pageTitle, post }) => {
  const [siteTitle, setSiteTitle] = useState(localStorage.getItem(SITE_TITLE_CACHE_KEY) || '');
  const [title, setTitle] = useState('');
  const [descriptionSEO, setDescriptionSEO] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogUrl, setOgUrl] = useState('');
  const [ogSiteName, setOgSiteName] = useState('');
  const [socialImageId, setSocialImageId] = useState(null);
  const [postSocialImage, setPostSocialImage] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mimeType, setMimeType] = useState('');

  const [searchDiscourageEngineVisibility, setDiscourageSearchEngineVisibility] = useState(false);

  const loadSiteTitle = async () => {
    try {
      if (!siteTitle) {
        const title = await get_site_title();
        if (title) {
          localStorage.setItem(SITE_TITLE_CACHE_KEY, title);
          setSiteTitle(title);
        }
      }
    } catch (err) {
      await APILogError(err.stack || String(err));
      console.error('Failed to load site title:', err);
    }
  };

  useEffect(() => {
    loadSiteTitle();
  }, []);

  useEffect(() => {
    const ws = getWebSocket();
    if (!ws) return;

    const handleMessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'UPDATE_SITE_TITLE') {
          const title = await get_site_title();
          if (title && title !== siteTitle) {
            localStorage.setItem(SITE_TITLE_CACHE_KEY, title);
            setSiteTitle(title);
          }
        }
      } catch (err) {
        await APILogError(err.stack || String(err));
        console.error('Failed to handle WS message for site title:', err);
      }
    };

    ws.addEventListener('message', handleMessage);
    return () => ws.removeEventListener('message', handleMessage);
  }, [siteTitle]);

  const fetchImageData = async () => {
    const data = await APIGetFileById(socialImageId);
    if (data.status == 200) {
      const item = data.data.getMediaFileById;
      const origin = window.location.origin.replace('5173', '8787');
      setImageUrl(`${origin}/r2/${item.filename}`);
      setMimeType(item.mimetype);

      setPostSocialImage(item);
      const attachmentMeta = JSON.parse(item.attachment_metadata);
      setWidth(attachmentMeta.width);
      setHeight(attachmentMeta.height);
    }
  };

  const replacePlaceholders = (str, replacements) => {
    if (typeof str !== 'string') return '';

    str = str.replace(/\u00A0|&nbsp;/g, ' ');

    return str
      .replace(/%title%/gi, replacements.title || '')
      .replace(/%sitetitle%/gi, replacements.siteTitle || '')
      .replace(/%seperator%/gi, replacements.seperator || '');
  };

  const fetchData = async () => {
    if (post) {
      const dataSiteSEO = await APIGetSiteSEOSettings();
      const data = await APIGetPostSEO(post.id);
      let parsedSiteSEO = null;
      if (dataSiteSEO.status == 200) {
        parsedSiteSEO = JSON.parse(dataSiteSEO.data.getSiteSEOSettings);
      }
      if (data.status == 200) {
        if (data.data.getPostSEO) {
          const parsed = JSON.parse(JSON.parse(data.data.getPostSEO));

          const siteTitle = parsed.ogSiteName ? parsed.ogSiteName : '';
          const title = post.post_title;
          const seperator =
            parsedSiteSEO &&
            typeof parsedSiteSEO.seperator === 'string' &&
            parsedSiteSEO.seperator.trim() !== ''
              ? parsedSiteSEO.seperator
              : '';

          const replacements = { title, siteTitle, seperator };

          setTitle(replacePlaceholders(parsed.title, replacements));
          setDescriptionSEO(replacePlaceholders(parsed.description, replacements));
          setOgTitle(replacePlaceholders(parsed.ogTitle, replacements));
          setOgDescription(replacePlaceholders(parsed.ogDescription, replacements));
          setOgUrl(parsed.ogUrl ? parsed.ogUrl : '');
          setOgSiteName(parsed.ogSiteName ? parsed.ogSiteName : '');
          setDiscourageSearchEngineVisibility(
            parsed.search_engine_visibility ? parsed.search_engine_visibility : false,
          );
          setSocialImageId(
            parsed && typeof parsed.socialImageId === 'number' ? parsed.socialImageId : null,
          );
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [post]);

  useEffect(() => {
    if (socialImageId != null) {
      fetchImageData();
    }
  }, [socialImageId]);

  return (
    <Helmet>
      <title>{title || `${pageTitle} | ${siteTitle}`}</title>
      {searchDiscourageEngineVisibility && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={descriptionSEO || `${description}`} />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || `${pageTitle}`} />
      <meta property="og:description" content={ogDescription || `${description}`} />
      <meta property="og:url" content={ogUrl || `${get_url()}`} />
      <meta property="og:site_name" content={ogSiteName || siteTitle} />
      <meta name="author" content={post?.author?.display_name ? post.author.display_name : '-'} />
      <link rel="canonical" href={window.location.href} />
      {imageUrl != '' && <meta property="og:image" content={imageUrl} />}
      {width != '' && <meta property="og:image:width" content={width} />}
      {height != '' && <meta property="og:image:height" content={height} />}
      {mimeType != '' && <meta property="og:image:type" content={mimeType} />}
    </Helmet>
  );
};

export default HeadMeta;
