import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createSafeSvgMarkup } from '../../Utils/sanitizeHtml';

const SidebarItem = ({ item, user, path }) => {
  const liRef = useRef(null);
  const submenuRef = useRef(null);
  const [submenuTop, setSubmenuTop] = useState(0);

  const IconFromString = ({ svgString }) => {
    return (
      <span className="sidebar-icon" dangerouslySetInnerHTML={createSafeSvgMarkup(svgString)} />
    );
  };

  const isActive = (matchPath) => {
    return path === matchPath || path.startsWith(matchPath + '/');
  };

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar-content');
    if (!sidebar || !liRef.current) return;

    const updateSubmenuPosition = () => {
      const liRect = liRef.current.getBoundingClientRect();
      const scrollTop = sidebar.scrollTop;

      const relativeTop = liRef.current.offsetTop - scrollTop;
      const submenuHeight = (item.children.length + 1) * 36;
      const top = relativeTop - submenuHeight / 2 + 36;

      setSubmenuTop(Math.max(0, Math.round(top)));
    };

    updateSubmenuPosition();

    sidebar.addEventListener('scroll', updateSubmenuPosition);

    return () => {
      sidebar.removeEventListener('scroll', updateSubmenuPosition);
    };
  }, []);

  return (
    <li
      ref={liRef}
      className={`sidebar-content-li ${
        isActive(item.slug) ? 'border-l-4 !border-menu-accent bg-gray-700' : ''
      }`}
    >
      <div className="group sidebar-wrapper">
        <Link to={item.slug} className="sidebar-content-li-link group">
          <IconFromString svgString={item.icon} />
          <span className="sidebar-item-name">{item.name}</span>
        </Link>

        {item.children.length > 0 && (
          <div
            ref={submenuRef}
            className="sidebar-item-children border !border-gray-800"
            style={{ top: submenuTop + 'px', left: '200px' }}
            id="dropdown"
          >
            <ul className="border-gray-800">
              {item.children
                .sort((a, b) => a.order - b.order)
                .map((child) => (
                  <li key={child.slug}>
                    <Link
                      to={
                        child.slug.includes(':user_id')
                          ? child.slug.replace(':user_id', user.id)
                          : child.slug
                      }
                      className="sidebar-item-child-name"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

export default SidebarItem;
