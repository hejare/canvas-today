import NavLink from "@/components/molecules/NavLink";
import { getDateAfterDate, getDateBeforeDate } from "@/lib/common";
import styled from "styled-components";

const NavLinksContainer = styled.div`
  margin-bottom: 16px;
`;
const StyledNavLink = styled(NavLink)`
  display: -webkit-inline-box;
`;

const ArtsPageNav = ({ date }) => {
  const older = getDateBeforeDate(date);
  const younger = getDateAfterDate(date);
  return (
    <NavLinksContainer>
      <StyledNavLink href={`/arts/${older}`}>
        <code>Older</code>
      </StyledNavLink>
      <StyledNavLink href={`/arts/${younger}`}>
        <code>Younger</code>
      </StyledNavLink>
    </NavLinksContainer>
  );
};
export default ArtsPageNav;
