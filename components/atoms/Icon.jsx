import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "styled-components";
// import { redirect } from "next/dist/server/api-utils";

const Icon = ({ name, className, fill, ...props }) => {
  try {
    const theme = useTheme();

    // eslint-disable-next-line global-require
    const IconComponent = require(`./icons/${name}.js`).default;
    return (
      <IconComponent
        className={className}
        fill={fill || theme.palette.action.text}
        {...props}
      />
    );
  } catch (e) {
    console.info(`Missing icon: ${name}`, e);
    return null;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  // className: ...
};

export default Icon;
