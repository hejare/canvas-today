import styled from "styled-components";

const StyledDiv = styled.div`
  cursor: pointer;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);

  ::after {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  :hover {
    transform: scale(1.2, 1.2);
  }
  :hover ::after {
    opacity: 1;
  }
  :active {
    background-color: yellow;
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledDiv {...props}>{children}</StyledDiv>;
};
export default Button;
