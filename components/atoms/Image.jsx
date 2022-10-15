/* eslint-disable @next/next/no-img-element */
import React from "react";
import styled from "styled-components";

const StyledImg = styled.img`
  ${({ ipfs }) => {
    if (ipfs === true) {
      return "border-left: 10px solid green;";
    } else if (ipfs === false) {
      return "border: 2px solid red;";
    }
    return "border: 1px solid black";
  }}
`;

const Image = ({ imageUrl, ...rest }) => {
  return <StyledImg src={imageUrl} {...rest} />;
};

export default Image;
