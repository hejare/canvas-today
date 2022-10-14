import Footer from "@/components/molecules/Footer";
import NavLink from "@/components/molecules/NavLink";
import styled from "styled-components";

const FooterWrapper = styled.div`
  margin-top: 32px;
  border-top: 1px solid #ccc;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  width: 100%;
  display: flex;
  place-content: center;
`;

const StyledNavLink = styled(NavLink)`
  border: none;
  margin-top: 0;
  position: relative;
  left: -32px;
  display: block;
  white-space: normal;
`;

const PageFooter = ({ healthStatus }) => (
  <FooterWrapper>
    <Footer>
      <Footer.Main>
        <Footer.Heading>
          <StyledNavLink href="/">Canvas Today</StyledNavLink>
        </Footer.Heading>
        <div style={{ alignSelf: "center" }}>
          <Footer.Text>Here are most API endpoints currently used.</Footer.Text>
          <Footer.Disclaimer>
            Be careful when navigating if you are not prepared for its effects
          </Footer.Disclaimer>
        </div>
      </Footer.Main>
      <Footer.Nav>
        <NavLink href="/api/health" status={healthStatus}>
          <code>api/health</code>
        </NavLink>

        <NavLink href="/api/headline">
          <code>api/headline</code>
        </NavLink>
        <NavLink href="/api/headline/aggregate">
          <code>api/headline/aggregate</code>
        </NavLink>
        <NavLink href="/api/headline/slack-action-vote">
          <code>api/headline/slack-action-vote</code>
        </NavLink>
        <NavLink href="/api/headline/slack-action-select">
          <code>api/headline/slack-action-select</code>
        </NavLink>

        <NavLink href="/api/art">
          <code>api/art</code>
        </NavLink>
        <NavLink href="/api/art/slack-action-vote">
          <code>api/art/slack-action-vote</code>
        </NavLink>
        <NavLink href="/api/art/slack-action-select">
          <code>api/art/slack-action-select</code>
        </NavLink>
      </Footer.Nav>
    </Footer>
  </FooterWrapper>
);

export default PageFooter;
