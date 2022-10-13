import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "components/Layout";
import ImageCard from "components/molecules/ImageCard";
import ArtImage from "components/molecules/ArtImage";

export default function ArtsPage() {
  const [arts, setArts] = useState([]);

  useEffect(() => {
    async function getArts() {
      const response = await backendClient.get("art", {
        params: { today: "1" },
      });
      setArts(response.result.sort((a, b) => b.votes - a.votes));
    }
    getArts();
  }, []);

  return (
    <Layout
      title="Canvas Today: Todays arts!"
      description="Each day, one headline from todays events will be voted fo, selected and
        finally after some further evaluation - outputs the art of today."
    >
      <main style={{ padding: 16, textAlign: "-webkit-center" }}>
        {arts.map(({ headline, votes, selected, id, imageUrl, seed }) => (
          <ImageCard key={id}>
            <ImageCard.Heading>{headline}</ImageCard.Heading>
            <ImageCard.Image>
              <ArtImage imageUrl={imageUrl} alt={headline} size="available" />
            </ImageCard.Image>
            <ImageCard.PropsWrapper>
              <ImageCard.Prop>{seed}</ImageCard.Prop>
              <ImageCard.Prop>Votes: {votes}</ImageCard.Prop>
              <ImageCard.Prop active={!!selected}>
                {selected ? "SELCTED" : "Not Selected"}
              </ImageCard.Prop>
            </ImageCard.PropsWrapper>
          </ImageCard>
        ))}
      </main>
    </Layout>
  );
}
