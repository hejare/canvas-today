import styled from "styled-components";

const Container = styled.div`
  color: ${({ theme }) => theme.palette.text.error};
`;

const ErrorMessage = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ErrorMessage;
