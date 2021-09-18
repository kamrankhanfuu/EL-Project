import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

const TooltipElement = ({ id, position = 'bottom', children }) => {
  const ref = React.useRef();
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const safeToggle = () => {
    if (ref.current) {
      setIsTooltipOpen(!isTooltipOpen);
    }
  }

  React.useEffect(() => {
    if (!ref.current) ref.current = true;
    return () => ref.current = false;
  })

  return (
    <Tooltip
      target={id}
      placement={position}
      isOpen={isTooltipOpen}
      toggle={safeToggle}
    >
      {children}
    </Tooltip>
  );
}

TooltipElement.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  position: PropTypes.string,
}

export default TooltipElement;
