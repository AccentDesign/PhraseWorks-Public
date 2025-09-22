(function () {
  if (!window.__FIELD_RENDERERS__) window.__FIELD_RENDERERS__ = {};
  const e = React.createElement;

  const renderDate = (dateString) => {
    if (!dateString) return e('td', null, '-');
    const date = new Date(dateString);
    if (isNaN(date)) return e('td', null, '-');
    return e('td', null, date.toLocaleDateString());
  };

  const truncate = (str, maxLen = 40) => {
    if (!str) return '-';
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
  };

  ['post_date', 'post_date_gmt', 'post_modified', 'post_modified_gmt'].forEach((fieldName) => {
    window.__FIELD_RENDERERS__[fieldName] = (post) => renderDate(post[fieldName]);
  });

  window.__FIELD_RENDERERS__['guid'] = (post) => {
    const guid = post.guid || '#';
    return e(
      'td',
      null,
      e(
        'a',
        {
          href: guid,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'text-blue-600 hover:text-blue-800',
        },
        guid,
      ),
    );
  };

  window.__FIELD_RENDERERS__['post_title'] = (post) => {
    return e(
      'td',
      null,
      e(
        'p',
        null,
        e(
          'a',
          {
            href: `/${post.post_name}`,
            className: 'link-blue-xs',
          },
          'View',
        ),
      ),
    );
  };

  window.__FIELD_RENDERERS__['post_author'] = (post) => {
    const authorName = post.author?.user_login || '-';
    return e('td', null, authorName);
  };

  window.__FIELD_RENDERERS__['content'] = (post) =>
    e('td', null, truncate(post.content || post.post_content));

  window.__FIELD_RENDERERS__['excerpt'] = (post) =>
    e('td', null, truncate(post.excerpt || post.post_excerpt));

  window.__FIELD_RENDERERS__['post_status'] = (post) => e('td', null, post.post_status);

  window.__FIELD_RENDERERS__['post_name'] = (post) => e('td', null, post.post_name);

  window.__FIELD_RENDERERS__['post_type'] = (post) => e('td', null, post.post_type);

  // SIGNAL READY
  window.__PLUGIN_REGISTERED__ = window.__PLUGIN_REGISTERED__ || 0;
  window.__PLUGIN_REGISTERED__++;
})();
