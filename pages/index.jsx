import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { backendClient } from "@/services/backendClient";
import {
  STATUS_NOK_TEXT,
  STATUS_OK_TEXT,
  STATUS_UNKNOWN_TEXT,
} from "@/services/responseConstants";
import ArtImage from "components/molecules/ArtImage";
import ImageCard from "components/molecules/ImageCard";
import Header from "components/molecules/Header";
import Footer from "components/molecules/Footer";

const LinkElement = ({ children, status, ...props }) => (
  <Link {...props}>
    <StyledClicker status={status}>{children}</StyledClicker>
  </Link>
);

const StyledClicker = styled.span`
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
    background-color: #ff00ff;
  }

  ${({ status }) => {
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

export default function Home() {
  const [health, setHealth] = useState({ status: STATUS_UNKNOWN_TEXT });
  const [arts, setArts] = useState([]);

  useEffect(() => {
    async function checkHealth() {
      const health = await backendClient.get("health");
      setHealth(health);
    }
    checkHealth();
  }, []);

  useEffect(() => {
    async function getArts() {
      const response = await backendClient.get("art", {
        params: { selected: "1" }, // TODO: Will be replaced by actually reading from the minted imaages (IPFS)
      });
      setArts(response.result.sort((a, b) => b.ts - a.ts));
    }
    getArts();
  }, []);

  return (
    <div>
      <Head>
        <title>Canvas Today App</title>
        <meta name="description" content="Canvas Today" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header>
          <Header.Main>
            <Header.Heading>Welcome to Canvas Today!</Header.Heading>
            <Header.Text>
              Each day, one headline from todays events will be voted fo,
              selected and finally after some further evaluation - outputs the
              art of today.
            </Header.Text>
          </Header.Main>
          <Header.Nav>
            <LinkElement href="/headlines">
              <code>Headlines</code>
            </LinkElement>
            <LinkElement href="/arts">
              <code>Arts</code>
            </LinkElement>
          </Header.Nav>
        </Header>

        <section style={{ textAlign: "-webkit-center", marginTop: 16 }}>
          {arts.map(({ headline, votes, id, date, imageUrl, seed }) => (
            <ImageCard key={id}>
              <ImageCard.Heading>{headline}</ImageCard.Heading>
              <ImageCard.Image>
                <ArtImage imageUrl={imageUrl} alt={headline} size="available" />
              </ImageCard.Image>
              <ImageCard.PropsWrapper>
                <ImageCard.Prop>{seed}</ImageCard.Prop>
                <ImageCard.Prop>Votes: {votes}</ImageCard.Prop>
                <ImageCard.Prop>{date}</ImageCard.Prop>
              </ImageCard.PropsWrapper>
            </ImageCard>
          ))}
        </section>
      </main>
      <Footer>
        <Footer.Main>
          <Footer.Heading>Canvas Today</Footer.Heading>
          <div>
            <Footer.Text>
              Here are most API endpoints currently used.
            </Footer.Text>
            <Footer.Disclaimer>
              Be careful for navigating if you are not prepared for its effects
            </Footer.Disclaimer>
          </div>
        </Footer.Main>
        <Footer.Nav>
          <LinkElement href="/api/health" status={health.status}>
            <code>api/health</code>
          </LinkElement>

          <LinkElement href="/api/headline">
            <code>api/headline</code>
          </LinkElement>
          <LinkElement href="/api/headline/aggregate">
            <code>api/headline/aggregate</code>
          </LinkElement>
          <LinkElement href="/api/headline/slack-action-vote">
            <code>api/headline/slack-action-vote</code>
          </LinkElement>
          <LinkElement href="/api/headline/slack-action-select">
            <code>api/headline/slack-action-select</code>
          </LinkElement>

          <LinkElement href="/api/art">
            <code>api/art</code>
          </LinkElement>
          <LinkElement href="/api/art/slack-action-vote">
            <code>api/art/slack-action-vote</code>
          </LinkElement>
          <LinkElement href="/api/art/slack-action-select">
            <code>api/art/slack-action-select</code>
          </LinkElement>
        </Footer.Nav>
      </Footer>
    </div>
  );
}
