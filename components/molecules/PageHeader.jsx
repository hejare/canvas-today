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
  ${({ minimize }) =>
    minimize
      ? `
    border: none;
    white-space: normal;
    padding: 2px 4px;
    margin-top: 4px;
  `
      : ""}
`;

const PageHeader = ({ title, description }) => {
  const router = useRouter();
  const scrollY = useScrollPosition(60 /*fps*/);

  const hideText = scrollY > 100;
  const minimize = scrollY > 300;
  const minimizeNavButton = minimize;
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
          <Header.Text minimize={hideText}>{description}</Header.Text>
        </Header.Main>
        <Header.Nav minimize={minimize}>
          <StyledNavLink
            href="/headlines"
            active={router.pathname === "/headlines"}
            minimize={minimizeNavButton}
          >
            <code>Headlines</code>
          </StyledNavLink>
          <StyledNavLink
            href="/arts"
            active={router.pathname === "/arts"}
            minimize={minimizeNavButton}
          >
            <code>Arts</code>
          </StyledNavLink>
        </Header.Nav>
      </Header>
    </HeaderWrapper>
  );
};

export default PageHeader;
