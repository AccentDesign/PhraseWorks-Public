import React, { useState, useEffect, useRef } from 'react';
import { classNames } from '../utils';

const ToolTip = ({ id, content, toolTipClass }) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const triggerElement = document.querySelector(`[data-tooltip-trigger="${id}"]`);
    const showTooltip = () => setVisible(true);
    const hideTooltip = () => setVisible(false);

    triggerElement.addEventListener('mouseenter', showTooltip);
    triggerElement.addEventListener('mouseleave', hideTooltip);
    if (visible) {
      const tooltipElement = tooltipRef.current;
      const rect = triggerElement.getBoundingClientRect();
      tooltipElement.style.top = `-70px`;
      tooltipElement.style.left = `-8px`;
    }

    return () => {
      triggerElement.removeEventListener('mouseenter', showTooltip);
      triggerElement.removeEventListener('mouseleave', hideTooltip);
    };
  }, [id, visible]);

  return (
    <div
      id={id}
      ref={tooltipRef}
      className={classNames(
        visible == true ? 'tooltip-visible visible opacity-100' : 'opacity-0 invisible',
        toolTipClass,
      )}
      role="tooltip"
    >
      {content}
    </div>
  );
};

export default ToolTip;
