/* eslint-disable @next/next/no-img-element */
import React from "react";

const Image = ({ imageUrl, ...rest }) => {
  return <img src={imageUrl} {...rest} />;
};

export default Image;
