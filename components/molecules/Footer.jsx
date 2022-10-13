import styled from "styled-components";

const StyledFooter = styled.footer`
  border-top: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding-bottom: 64px;
  margin-top: 32px;
`;

const Footer = ({ children }) => <StyledFooter>{children}</StyledFooter>;

const StyledMain = styled.main`
  display: flex;
  /* flex-direction: column; */
`;

const Main = ({ children }) => <StyledMain>{children}</StyledMain>;

const StyledH1 = styled.h1`
  padding: 0 16px;
  margin: 16px 0 0 0;
`;

const Heading = ({ children }) => <StyledH1>{children}</StyledH1>;

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
