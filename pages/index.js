import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { backendClient } from "@/services/backendClient";

const PageLinkContainer = styled.ul`
  flex-wrap: wrap;
  display: flex;
  border: 1px solid green;
  margin: 10px;
  text-align: left;
  padding: 16px;
`;

const LinkContainer = styled.ul`
  flex-wrap: wrap;
  display: flex;
  margin: 10px;
  border: 1px solid red;
  text-align: left;
  padding: 16px;
`;

const LinkElement = ({ children, ...props }) => (
  <StyledLi>
    <Link {...props}>
      <StyledClicker>{children}</StyledClicker>
    </Link>
  </StyledLi>
);

const StyledLink = styled(LinkElement)``;

const StyledClicker = styled.span`
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
    background-color: #ff00ff;
  }
  padding: 16px;
  border: 1px solid orange;
`;

const StyledLi = styled.li`
  margin: 4px;
  display: flex;
`;

export default function Home() {
  const [health, setHealth] = useState();
  useEffect(() => {
    async function checkHealth() {
      const health = await backendClient.get("health");
      setHealth(health);
    }
    checkHealth();
  }, []);

  return (
    <div>
      <Head>
        <title>Canvas Today App</title>
        <meta name="description" content="Canvas Today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to Canvas Today!</h1>

        <div>
          Pages:
          <PageLinkContainer>
            <StyledLink href="/headlines">
              <code>Headlines</code>
            </StyledLink>
            <StyledLink href="/arts">
              <code>Arts</code>
            </StyledLink>
          </PageLinkContainer>
        </div>

        <div>
          (Be careful for navigating to api-endpoints)
          <LinkContainer>
            <StyledLink href="/api/health">
              <code>api/health</code>
            </StyledLink>

            <StyledLink href="/api/headline">
              <code>api/headline</code>
            </StyledLink>
            <StyledLink href="/api/headline/aggregate">
              <code>api/headline/aggregate</code>
            </StyledLink>
            <StyledLink href="/api/headline/slack-action-vote">
              <code>api/headline/slack-action-vote</code>
            </StyledLink>
            <StyledLink href="/api/headline/slack-action-select">
              <code>api/headline/slack-action-select</code>
            </StyledLink>

            <StyledLink href="/api/art">
              <code>api/art</code>
            </StyledLink>
            <StyledLink href="/api/art/slack-action-vote">
              <code>api/art/slack-action-vote</code>
            </StyledLink>
            <StyledLink href="/api/art/slack-action-select">
              <code>api/art/slack-action-select</code>
            </StyledLink>
          </LinkContainer>
        </div>
      </main>
      {/* <section>Status: {health?.status}</section> */}
    </div>
  );
}
