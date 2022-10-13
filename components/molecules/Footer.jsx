import styled from "styled-components";

const StyledFooter = styled.footer`
  max-width: min(100vw, ${({ theme }) => theme.maxOuterWidth});
  display: flex;
  flex-direction: column;
  padding-bottom: 64px;
`;

const Footer = ({ children }) => <StyledFooter>{children}</StyledFooter>;

const StyledMain = styled.main`
  display: flex;
`;

const Main = ({ children }) => <StyledMain>{children}</StyledMain>;

const StyledH2 = styled.h2`
  padding: 0 16px;
`;

const Heading = ({ children }) => <StyledH2>{children}</StyledH2>;

const StyledTextDiv = styled.div`
  margin-top: 16px;
  padding: 0 16px;
`;

const TextWrapper = ({ children }) => <StyledTextDiv>{children}</StyledTextDiv>;

const StyledDisclaimerDiv = styled.div`
  font-style: italic;
  margin-top: 0px;
  padding: 0 16px;
`;

const DisclaimerWrapper = ({ children }) => (
  <StyledDisclaimerDiv>{children}</StyledDisclaimerDiv>
);

const StyledNav = styled.nav`
  display: flex;
  text-align: left;
  margin: 0;
  padding-right: 16px;
  flex-wrap: wrap;
`;

const NavigationWrapper = ({ children }) => <StyledNav>{children}</StyledNav>;

Footer.Main = Main;
Footer.Heading = Heading;
Footer.Text = TextWrapper;
Footer.Disclaimer = DisclaimerWrapper;
Footer.Nav = NavigationWrapper;

export default Footer;
