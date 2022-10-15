import Image from "@/components/atoms/Image";
import styled from "styled-components";

const ArtImage = styled(Image)`
  ${({ size }) =>
    size === "available" ? "width: -webkit-fill-available;" : ""};
`;

export default ArtImage;
