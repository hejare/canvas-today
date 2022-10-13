import Link from "next/link";
import {
  STATUS_NOK_TEXT,
  STATUS_OK_TEXT,
  STATUS_UNKNOWN_TEXT,
} from "@/services/responseConstants";
import styled from "styled-components";

const NavLink = ({ children, active, status, className, ...props }) => (
  <Link {...props}>
    <StyledClicker active={active} status={status} className={className}>
      {children}
    </StyledClicker>
  </Link>
);

const StyledClicker = styled.span`
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
    background-color: #ff00ff;
  }

  ${({ theme, status, active }) => {
    if (active) {
      return `
      background-color: ${theme.palette.background.active};
      color: ${theme.palette.text.active};
      `;
    }

    if (!status) {
      return;
    }
    switch (status) {
      case STATUS_UNKNOWN_TEXT:
        return "background-color: #aaaa33";
      case STATUS_OK_TEXT:
        return "background-color: #00ff00";
      case STATUS_NOK_TEXT:
        return "background-color: #ff0000";
      default:
        return "background-color: #ffff00";
    }
  }};

  align-self: center;
  margin-top: 16px;
  margin-left: 16px;
  padding: 16px;
  border: 1px solid orange;
`;

export default NavLink;
