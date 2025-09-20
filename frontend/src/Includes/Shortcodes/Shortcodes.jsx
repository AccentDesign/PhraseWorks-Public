import React from 'react';
import parse, { domToReact } from 'html-react-parser';

function parseShortcodeProps(str) {
  const props = {};
  const regex = /(\w+)=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(str))) {
    props[match[1]] = match[2];
  }
  return props;
}

export function parseContentWithShortcodes(content, shortcodes, context = {}) {
  const { currentPathSegment = '' } = context;

  const shortcodeRegex = /\[([a-zA-Z0-9_]+)([^\]]*)\]/g;

  const options = {
    replace: (domNode) => {
      // If it’s a text node, handle shortcodes in text
      if (domNode.type === 'text') {
        const text = domNode.data;
        const elements = [];
        let lastIndex = 0;
        let match;

        while ((match = shortcodeRegex.exec(text)) !== null) {
          const [fullMatch, shortcodeName, propsString = ''] = match;
          const index = match.index;

          if (index > lastIndex) {
            elements.push(text.slice(lastIndex, index));
          }
          lastIndex = index + fullMatch.length;

          const shortcodeKey = shortcodeName.toLowerCase();
          const ComponentOrPath = shortcodes[shortcodeKey];
          const props = parseShortcodeProps(propsString);

          if (ComponentOrPath) {
            elements.push(
              <ComponentOrPath
                key={index}
                {...props}
                currentPathSegment={currentPathSegment} // pass context prop here
              />,
            );
          } else {
            elements.push(fullMatch);
          }
        }

        if (lastIndex < text.length) {
          elements.push(text.slice(lastIndex));
        }

        if (elements.length === 0) return null;
        return elements.length === 1 ? elements[0] : <>{elements}</>;
      }

      // ✅ Fix <p> wrapping a shortcode
      if (domNode.name === 'p' && domNode.children) {
        const children = domToReact(domNode.children, options);

        // If children contains any React element (your shortcode),
        // unwrap the <p> and return a fragment instead:
        const hasComponent = React.Children.toArray(children).some((child) =>
          React.isValidElement(child),
        );

        if (hasComponent) {
          return <>{children}</>; // <-- removes the <p>
        }
      }

      return undefined;
    },
  };

  return parse(content, options);
}
