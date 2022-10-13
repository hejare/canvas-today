import React from "react";
import PropTypes from "prop-types";

const Checked = ({ width, height, fill, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 10"
      {...rest}
    >
      <path
        fill={fill}
        fillRule="evenodd"
        d="M11.638.366C11.404.132 11.091 0 10.767 0c-.324 0-.638.132-.872.366L4.166 6.094 2.105 4.033c-.234-.234-.548-.366-.872-.366-.324 0-.637.132-.871.365-.237.235-.364.553-.362.868 0 .314.118.633.361.877l2.933 2.934c.243.241.563.355.878.355v.001c.337-.002.647-.138.878-.368l6.588-6.588c.239-.24.363-.56.361-.877v-.005c-.001-.309-.122-.625-.361-.863"
      />
    </svg>
  );
};

Checked.defaultProps = {
  width: "100%",
  height: "100%",
  fill: "#FFFFFF",
};
Checked.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
};

export default Checked;
