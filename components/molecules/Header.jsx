import styled from "styled-components";

const StyledHeader = styled.header`
  width: 100vw;
  max-width: min(100vw, ${({ theme }) => theme.maxOuterWidth});
  /* ${({ theme }) => theme.breakpoints.desktop`
    max-width: min(100vw, ${({ theme }) => theme.maxOuterWidth});
  `} */
  display: flex;
  padding-bottom: 16px;
  justify-content: space-between;
  ${({ minimize }) => (minimize ? "height: 40px;" : "")}
`;

const Header = ({ children, minimize }) => (
  <StyledHeader minimize={minimize}>{children}</StyledHeader>
);

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
`;

const Main = ({ children, minimize }) => (
  <StyledMain minimize={minimize}>{children}</StyledMain>
);

const StyledSpan = styled.span`
  color: #999;
  font-size: 0.8em;
  position: absolute;
  text-transform: uppercase;
  top: ${({ minimize }) => (minimize ? "-4px" : "8px")};
  padding-left: 16px;
  ${({ minimize }) =>
    minimize ? "transform: scale(0.5, 0.5) translateX(-42px);" : ""};
`;

const SupHeading = ({ children, minimize }) => (
  <StyledSpan minimize={minimize}>{children}</StyledSpan>
);

const StyledH1 = styled.h1`
  text-transform: capitalize;
  padding: ${({ minimize }) => (minimize ? "0" : "16px 0 0 0")};
  margin: 0 0 0 16px;
`;

const Heading = ({ children, minimize }) => (
  <StyledH1 minimize={minimize}>{children}</StyledH1>
);

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
  margin-bottom: auto;
  ${({ minimize }) => (minimize ? "transform: scale(0.4, 0.4);" : "")}
`;

const NavigationWrapper = ({ children, minimize }) => (
  <StyledNav minimize={minimize}>{children}</StyledNav>
);

Header.Main = Main;
Header.SupHeading = SupHeading;
Header.Heading = Heading;
Header.Text = TextWrapper;
Header.Nav = NavigationWrapper;

export default Header;
