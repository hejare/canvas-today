import Image from "components/atoms/Image";
import styled from "styled-components";

const ArtImage = styled(Image)`
  border: 1px solid black;
  ${({ size }) =>
    size === "available" ? "width: -webkit-fill-available;" : ""};
`;

export default ArtImage;
