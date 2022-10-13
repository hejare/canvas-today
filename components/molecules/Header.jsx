import styled from "styled-components";

const StyledHeader = styled.header`
  max-width: min(100vw, ${({ theme }) => theme.maxOuterWidth});
  display: flex;
  padding-bottom: 16px;
  justify-content: space-between;
`;

const Header = ({ children }) => <StyledHeader>{children}</StyledHeader>;

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
`;

const Main = ({ children }) => <StyledMain>{children}</StyledMain>;

const StyledH1 = styled.h1`
  padding: 0 16px;
  margin: 16px 0 0 0;
`;

const Heading = ({ children }) => <StyledH1>{children}</StyledH1>;

const StyledTextDiv = styled.div`
  margin-top: 16px;
  padding-left: 16px;
`;

const TextWrapper = ({ children }) => <StyledTextDiv>{children}</StyledTextDiv>;

const StyledNav = styled.nav`
  display: flex;
  justify-content: right;
  margin: 0;
  padding-right: 16px;
  flex-wrap: wrap;
`;

const NavigationWrapper = ({ children }) => <StyledNav>{children}</StyledNav>;

Header.Main = Main;
Header.Heading = Heading;
Header.Text = TextWrapper;
Header.Nav = NavigationWrapper;

export default Header;
