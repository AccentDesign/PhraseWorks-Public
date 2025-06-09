import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import PostsList from './Shortcodes/PostsList';
import Pagination from './Shortcodes/Pagination';

const Content = ({ pageData, posts, total, page, perPage, setPage }) => {
  const preprocessPostContent = (content) => {
    return content.replace(/\[PostList\]/g, '<postlist-placeholder />');
  };

  const transformedContent = preprocessPostContent(pageData?.post_content || '');

  let placeholderKey = 0;

  const buildParsedNodes = () => {
    const output = [];

    const result = parse(transformedContent, {
      replace: (node) => {
        if (node.name === 'p' && node.children?.length) {
          const hasPlaceholder = node.children.some(
            (child) => child.name === 'postlist-placeholder',
          );

          if (hasPlaceholder) {
            // Remove the placeholders from this paragraph
            const cleanedChildren = node.children.filter(
              (child) => child.name !== 'postlist-placeholder',
            );

            output.push(
              <p key={`p-${placeholderKey}`}>{domToReact(cleanedChildren)}</p>,
              <PostsList key={`pl-${placeholderKey}`} posts={posts} />,
              <Pagination
                key={`pg-${placeholderKey}`}
                total={total}
                page={page}
                perPage={perPage}
                setPage={setPage}
              />,
            );

            placeholderKey++;
            return null; // Skip this node from normal rendering
          }
        }

        return undefined;
      },
    });

    // Add all other parsed content (that wasn't intercepted)
    if (Array.isArray(result)) {
      result.forEach(
        (r, i) => r && output.push(<React.Fragment key={`frag-${i}`}>{r}</React.Fragment>),
      );
    } else if (result) {
      output.push(result);
    }

    return output;
  };

  return pageData?.post_content ? <div>{buildParsedNodes()}</div> : null;
};

export default Content;
