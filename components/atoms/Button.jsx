import styled from "styled-components";
import { SpinnerBar } from "@/components/atoms/SpinnerBar";

const EnabledDiv = styled.div`
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
  ${({ disabled }) => (disabled ? "background-color: black;" : "")}
`;

const LoadingDiv = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

const DisabledDiv = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.palette.background.disabled};
  color: ${({ theme }) => theme.palette.text.disabled};
`;

const Button = ({ children, loading, disabled, ...props }) => {
  if (loading) {
    return (
      <LoadingDiv {...props}>
        <SpinnerBar />
      </LoadingDiv>
    );
  }
  if (disabled) {
    return <DisabledDiv {...props}>{children}</DisabledDiv>;
  }
  return <EnabledDiv {...props}>{children}</EnabledDiv>;
};
export default Button;
