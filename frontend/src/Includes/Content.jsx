import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import PostsList from './Shortcodes/PostsList';
import Pagination from './Shortcodes/Pagination';
import PluginErrorBoundary from '../Components/PluginErrorBoundary';

const shortcodeRegex = /\[([a-zA-Z0-9_]+)([^\]]*)\]/g;
const attrRegex = /([a-zA-Z0-9_:-]+)="([^"]*)"/g;

const parseShortcodeProps = (str) => {
  const props = {};
  let match;
  while ((match = attrRegex.exec(str))) {
    props[match[1]] = match[2];
  }
  return props;
};

const Content = ({ pageData, posts, total, page, perPage, setPage, shortcodes }) => {
  const renderShortcode = (name, props, key) => {
    const lowerName = name.toLowerCase();

    if (lowerName === 'postlist' && posts) {
      return <PostsList key={key} {...props} posts={posts} />;
    }
    if (lowerName === 'pagination') {
      return (
        <Pagination
          key={key}
          total={total}
          page={page}
          perPage={perPage}
          setPage={setPage}
          {...props}
        />
      );
    }

    const PluginComponent = shortcodes?.[lowerName];
    if (PluginComponent) {
      return (
        <PluginErrorBoundary key={key} pluginName={`Shortcode: ${name}`}>
          <PluginComponent {...props} />
        </PluginErrorBoundary>
      );
    }

    return `[${name}${
      props
        ? ' ' +
          Object.entries(props)
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ')
        : ''
    }]`;
  };

  const options = {
    replace: (domNode) => {
      if (domNode.type === 'text') {
        const { data: text } = domNode;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = shortcodeRegex.exec(text)) !== null) {
          const [fullMatch, shortcodeName, propsString] = match;
          const index = match.index;

          if (index > lastIndex) {
            elements.push(text.slice(lastIndex, index));
          }

          const props = parseShortcodeProps(propsString || '');
          elements.push(renderShortcode(shortcodeName, props, index));

          lastIndex = index + fullMatch.length;
        }

        if (lastIndex < text.length) {
          elements.push(text.slice(lastIndex));
        }

        return elements.length === 1 ? elements[0] : <>{elements}</>;
      }

      if (domNode.name === 'p' && domNode.children) {
        const children = domToReact(domNode.children, options);
        const hasComponent = React.Children.toArray(children).some((child) =>
          React.isValidElement(child),
        );
        if (hasComponent) return <>{children}</>;
      }

      return undefined;
    },
  };

  const parsed = pageData?.post_content ? parse(pageData.post_content, options) : null;

  return <div>{parsed}</div>;
};

export default Content;
