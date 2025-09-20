import React, { useEffect, useState } from 'react';
import { get_fields, get_site_url } from '@/Includes/Functions';
import { createSafeMarkup } from '@/Utils/sanitizeHtml';

const PostCustomFields = ({ post }) => {
  const [text1, setText1] = useState(null);
  const [textArea, setTextArea] = useState(null);
  const [range, setRange] = useState(null);
  const [number, setNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [url, setUrl] = useState(null);
  const [password, setPassword] = useState(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [wYSIWYG, setWYSIWYG] = useState(null);
  const [link, setLink] = useState(null);
  const [postObj, setPostObj] = useState(null);
  const [pageObj, setPageObj] = useState(null);
  const [relationship, setRelationship] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (post?.id) {
        const fieldsData = await get_fields(post.id);
        if (fieldsData != null) {
          const fields = JSON.parse(fieldsData);

          if (text1 === null)
            setText1(
              fields.find((field) => field.name == 'text-1')
                ? fields.find((field) => field.name == 'text-1').value
                : null,
            );
          if (textArea === null)
            setTextArea(
              fields.find((field) => field.name == 'text-area-1')
                ? fields.find((field) => field.name == 'text-area-1').value
                : null,
            );
          if (range === null)
            setRange(
              fields.find((field) => field.name == 'range-1')
                ? fields.find((field) => field.name == 'range-1').value
                : null,
            );
          if (number === null)
            setNumber(
              fields.find((field) => field.name == 'number-1')
                ? fields.find((field) => field.name == 'number-1').value
                : null,
            );
          if (email === null)
            setEmail(
              fields.find((field) => field.name == 'email-1')
                ? fields.find((field) => field.name == 'email-1').value
                : null,
            );
          if (url === null)
            setUrl(
              fields.find((field) => field.name == 'url')
                ? fields.find((field) => field.name == 'url').value
                : null,
            );
          if (password === null)
            setPassword(
              fields.find((field) => field.name == 'password')
                ? fields.find((field) => field.name == 'password').value
                : null,
            );

          if (image === null) {
            const raw = fields.find((field) => field.name == 'image-1');
            setImage(raw ? JSON.parse(raw.data) : null);
          }

          if (file === null) {
            const raw = fields.find((field) => field.name == 'file-1');
            setFile(raw ? JSON.parse(raw.data) : null);
          }

          if (wYSIWYG === null)
            setWYSIWYG(
              fields.find((field) => field.name == 'wysiwyg-1')
                ? fields.find((field) => field.name == 'wysiwyg-1').value
                : null,
            );

          if (link === null) {
            const raw = fields.find((field) => field.name == 'link-1');
            setLink(raw ? JSON.parse(raw.data) : null);
          }

          if (postObj === null) {
            const raw = fields.find((field) => field.name == 'post-object');
            setPostObj(raw ? JSON.parse(raw.data) : null);
          }

          if (pageObj === null) {
            const raw = fields.find((field) => field.name == 'page-link-1');
            setPageObj(raw ? JSON.parse(raw.data) : null);
          }

          if (relationship === null) {
            const raw = fields.find((field) => field.name == 'relationship-1');
            setRelationship(raw ? JSON.parse(raw.data) : null);
          }
        }
      }
    };
    fetchData();
  }, [post?.id]);

  return (
    <>
      {text1 && (
        <div className="mt-4">
          <strong>Text Field:</strong> {text1}
        </div>
      )}
      {textArea && (
        <div className="mt-4">
          <strong>Text Area Field:</strong> {textArea}
        </div>
      )}
      {range && (
        <div className="mt-4">
          <strong>Range:</strong> {range}
        </div>
      )}
      {number && (
        <div className="mt-4">
          <strong>Number:</strong> {number}
        </div>
      )}
      {email && (
        <div className="mt-4">
          <strong>Email:</strong> {email}
        </div>
      )}
      {url && (
        <div className="mt-4">
          <strong>Url:</strong> {url}
        </div>
      )}
      {password && (
        <div className="mt-4">
          <strong>Password:</strong> {password}
        </div>
      )}
      {image && (
        <div className="mt-4">
          <strong>Image:</strong>{' '}
          <img
            src={`${get_site_url()}/uploads/${image.filename}`}
            className="w-[150px] h-[150px] object-cover"
            alt={image.alt || ''}
          />
        </div>
      )}
      {file && (
        <div className="mt-4">
          <strong>File:</strong>{' '}
          <a
            href={`${get_site_url()}/uploads/${file.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[150px] h-[150px] object-cover"
          >
            {file.filename}
          </a>
        </div>
      )}
      {wYSIWYG && (
        <div className="mt-4">
          <strong>WYSIWYG:</strong> <div dangerouslySetInnerHTML={createSafeMarkup(wYSIWYG)} />
        </div>
      )}
      {link && (
        <div className="mt-4">
          <strong>Link:</strong>{' '}
          <a
            href={`${get_site_url()}/${link.post_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 hover:text-blue-800"
          >
            {link.post_title}
          </a>
        </div>
      )}

      {postObj && (
        <div className="mt-4">
          <strong>Post:</strong>{' '}
          <a
            href={`${get_site_url()}/${postObj.post_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 hover:text-blue-800"
          >
            {postObj.post_title}
          </a>
        </div>
      )}

      {pageObj && (
        <div className="mt-4">
          <strong>Page:</strong>{' '}
          <a
            href={`${get_site_url()}/${pageObj.post_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-500 hover:text-blue-800"
          >
            {pageObj.post_title}
          </a>
        </div>
      )}
      {relationship && (
        <div className="mt-4">
          <strong>Relationship:</strong>{' '}
          {Array.isArray(relationship) &&
            relationship.map((postItem) => (
              <a
                key={postItem.id}
                href={`${get_site_url()}/${postItem.post_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 hover:text-blue-800"
              >
                {postItem.post_title}
              </a>
            ))}
        </div>
      )}
    </>
  );
};

export default PostCustomFields;
