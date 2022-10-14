import Header from "@/components/molecules/Header";
import NavLink from "@/components/molecules/NavLink";
import styled from "styled-components";
import { useRouter } from "next/router";
import useScrollPosition from "@react-hook/window-scroll";

const HeaderWrapper = styled.div`
  z-index: ${({ theme }) => theme.zIndex.header};
  position: fixed;
  display: flex;
  place-content: center;
  border-bottom: 1px solid #ccc;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.background.primary};
  box-shadow: 0px 10px 32px black;
`;

const StyledNavLink = styled(NavLink)`
  border: none;
  position: relative;
  left: -32px;
  display: block;
  white-space: normal;
`;

const PageHeader = ({ title, description }) => {
  const router = useRouter();
  const scrollY = useScrollPosition(60 /*fps*/);

  const hideText = scrollY > 100;
  const minimize = scrollY > 300;
  const hideNav = minimize;
  return (
    <HeaderWrapper>
      <Header minimize={minimize}>
        <Header.Main>
          <Header.SupHeading minimize={minimize}>
            Canvas Today:
          </Header.SupHeading>
          <Header.Heading minimize={minimize}>
            {title}
            {/* <StyledNavLink href="/">{title}</StyledNavLink> */}
          </Header.Heading>
          {!hideText && <Header.Text>{description}</Header.Text>}
        </Header.Main>
        {!hideNav && (
          <Header.Nav>
            <NavLink
              href="/headlines"
              active={router.pathname === "/headlines"}
            >
              <code>Headlines</code>
            </NavLink>
            <NavLink href="/arts" active={router.pathname === "/arts"}>
              <code>Arts</code>
            </NavLink>
          </Header.Nav>
        )}
      </Header>
    </HeaderWrapper>
  );
};

export default PageHeader;
