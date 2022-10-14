import React, { useEffect, useState } from "react";
import Head from "next/head";
import styled from "styled-components";
// import { useAuth } from "@/context/auth/AuthContext";
// import { DisconnectButton } from "@/components/molecules/DisconnectButton";
// import { NavButton } from "@/components/molecules/NavButton";
import { backendClient } from "@/services/backendClient";
import { STATUS_UNKNOWN_TEXT } from "@/services/responseConstants";
import PageHeader from "@/components/molecules/PageHeader";
import PageFooter from "@/components/molecules/PageFooter";

const LayoutComposition = styled.div`
  height: 100vh;
  /* border: 2px solid green; */
  background-color: "red";
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ArrangeItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: ${({ theme }) => theme.maxContentWidth};
  width: 100vw;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  padding-top: ${({ theme }) => theme.headerHeight};
`;

const Content = styled.div`
  height: -webkit-fill-available;
  transition: opacity 1s;
  opacity: ${({ opacity }) => opacity};
  padding-bottom: 64px;
`;

// const disconnectedNavItems = [
//   {
//     _id: "connect",
//     slug: "/connect",
//     pathname: "/connect",
//     component: <NavButton href={{ pathname: "/connect" }}>Connect</NavButton>,
//   },
// ];

// const connectedNavItems = [
//   {
//     _id: "wallet",
//     slug: "wallet",
//     pathname: "/wallet",
//     component: <NavButton href={{ pathname: "/wallet" }}>Wallet</NavButton>,
//   },
//   {
//     _id: "nft",
//     slug: "nft",
//     pathname: "/nft",
//     component: <NavButton href={{ pathname: "/nft" }}>NFT</NavButton>,
//   },
//   {
//     _id: "invoice",
//     slug: "invoice",
//     pathname: "/invoice",
//     component: <NavButton href={{ pathname: "/invoice" }}>Invoice</NavButton>,
//   },
//   {
//     _id: "disconnect",
//     component: <DisconnectButton>Disconnect</DisconnectButton>,
//   },
// ];

function Layout({ children, title, description }) {
  // const [navItems, setNavItems] = useState();
  // const { isConnected } = useAuth();
  const [opacity, setOpacity] = useState(0);
  const [health, setHealth] = useState({ status: STATUS_UNKNOWN_TEXT });

  useEffect(() => {
    setOpacity(1);
  });

  // useEffect(() => {
  //   if (isConnected) {
  //     setNavItems(connectedNavItems);
  //   } else if (isConnected === false) {
  //     setNavItems(disconnectedNavItems);
  //   }
  // }, [isConnected]);

  useEffect(() => {
    async function checkHealth() {
      const health = await backendClient.get("health");
      setHealth(health);
    }
    checkHealth();
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/letterc.svg" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, viewport-fit=cover"
        />
      </Head>
      <LayoutComposition>
        {/* <PageHeader title={title} navItems={navItems} /> */}
        <PageHeader title={title} description={description} />
        <ArrangeItems>
          <Content opacity={opacity}>{children}</Content>
        </ArrangeItems>
        <PageFooter healthStatus={health.status} />
      </LayoutComposition>
    </>
  );
}

export default Layout;
