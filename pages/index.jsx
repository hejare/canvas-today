import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import ArtImage from "@/components/molecules/ArtImage";
import ImageCard from "@/components/molecules/ImageCard";
import Layout from "@/components/Layout";

export default function Home() {
  const [arts, setArts] = useState([]);

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
    <Layout
      title="Welcome to Canvas Today!"
      description="Each day, one headline from todays events will be voted fo, selected and
        finally after some further evaluation - outputs the art of today."
    >
      <main style={{ padding: 16 }}>
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
    </Layout>
  );
}
