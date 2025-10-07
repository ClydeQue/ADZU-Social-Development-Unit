import PropTypes from 'prop-types';

const WhiteContainer = ({ children }) => {
  return (
    // Single White Container Wrapper
    <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
      {children}
    </div>
  );
};

WhiteContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WhiteContainer;
