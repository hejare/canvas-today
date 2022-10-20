import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import NftCard from "@/components/molecules/NftCard";
// import ArtImage from "@/components/molecules/ArtImage";

// TODO: Lock down to connected wallets NFTs
export default function NftsPage() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function getNfts() {
      const response = await backendClient.get("hre/nft");
      console.log(response);
      setNfts(response.result?.ownedNfts);
    }
    getNfts();
  }, []);

  return (
    <Layout
      title="Your NFTs"
      description="Yourt collected NFTs are listed here. Be proud - Be awesome - Be unique!"
    >
      <main style={{ padding: 16, textAlign: "-webkit-center" }}>
        {nfts.map(
          ({
            balance,
            timeLastUpdated,
            tokenType,
            tokenId,
            metadataError,
            contract,
          }) => (
            <NftCard key={tokenId}>
              {/* <NftCard.Heading>{headline}</NftCard.Heading>
            <NftCard.Image>
              <ArtImage imageUrl={imageUrl} alt={headline} size="available" />
            </NftCard.Image> */}
              <NftCard.PropsWrapper>
                <NftCard.Prop>Number of items: {balance}</NftCard.Prop>
                <NftCard.Prop>Last updated: {timeLastUpdated}</NftCard.Prop>
                <NftCard.Prop>Token type: {tokenType}</NftCard.Prop>
                <NftCard.Prop>Token Id: {tokenId}</NftCard.Prop>
                <NftCard.ErrorProp>{metadataError}</NftCard.ErrorProp>
                <NftCard.ContractProps {...contract} />
              </NftCard.PropsWrapper>
            </NftCard>
          ),
        )}
      </main>
    </Layout>
  );
}
