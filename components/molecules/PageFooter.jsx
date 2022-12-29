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
          <code>/health</code>
        </NavLink>

        <NavLink href="/api/headline">
          <code>/headline</code>
        </NavLink>
        <NavLink href="/api/art">
          <code>/art</code>
        </NavLink>
        <NavLink href="/api/nft">
          <code>/nft</code>
        </NavLink>

        <NavLink href="/api/hre/art">
          <code>/hre/art</code>
        </NavLink>
        <NavLink href="/api/hre/nft">
          <code>/hre/nft</code>
        </NavLink>
        <NavLink href="/api/hre/balance">
          <code>/hre/balance</code>
        </NavLink>
        <NavLink href="/api/hre/info">
          <code>/hre/info</code>
        </NavLink>

        <NavLink href="/api/cron/aggregate-headline">
          <code>/cron/aggregate-headline</code>
        </NavLink>
        {/* <NavLink href="/api/cron/generate-art">
          <code>/cron/generate-art</code>
        </NavLink>
        <NavLink href="/api/cron/update-generated-art">
          <code>/cron/update-generated-art</code>
        </NavLink> */}
      </Footer.Nav>
    </Footer>
  </FooterWrapper>
);

export default PageFooter;
