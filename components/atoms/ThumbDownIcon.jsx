import Icon from "@/components/atoms/Icon";
import styled from "styled-components";

const StyledIcon = styled(Icon)`
  transform: rotate(180deg);
`;

const ThumbDownIcon = ({ className }) => (
  <StyledIcon
    className={className}
    name="thumbup"
    fill="#ff0000"
    width="24"
    height="24"
  />
);

export default ThumbDownIcon;
