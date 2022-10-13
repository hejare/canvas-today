import Header from "components/molecules/Header";
import NavLink from "components/molecules/NavLink";
import styled from "styled-components";
import { useRouter } from "next/router";

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

  return (
    <HeaderWrapper>
      <Header>
        <Header.Main>
          <Header.Heading>
            <StyledNavLink href="/">{title}</StyledNavLink>
          </Header.Heading>
          <Header.Text>{description}</Header.Text>
        </Header.Main>
        <Header.Nav>
          <NavLink href="/headlines" active={router.pathname === "/headlines"}>
            <code>Headlines</code>
          </NavLink>
          <NavLink href="/arts" active={router.pathname === "/arts"}>
            <code>Arts</code>
          </NavLink>
        </Header.Nav>
      </Header>
    </HeaderWrapper>
  );
};

export default PageHeader;
