import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "components/Layout";
import NewsHeadline from "components/molecules/NewsHeadline";

export default function HeadlinesPage() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    async function getHeadlines() {
      const response = await backendClient.get("headline", {
        params: { today: "1" },
      });
      setHeadlines(response.result.sort((a, b) => b.votes - a.votes));
    }
    getHeadlines();
  }, []);

  return (
    <Layout
      title="Canvas Today: Todays headlines!"
      description="Each day, one headline from todays events will be voted fo, selected and
        finally after some further evaluation - outputs the art of today."
    >
      <main style={{ padding: 16, textAlign: "-webkit-center" }}>
        {headlines.map(({ headline, votes, selected, id }) => (
          <NewsHeadline key={id}>
            <NewsHeadline.Heading>{headline}</NewsHeadline.Heading>
            <NewsHeadline.PropsWrapper>
              <NewsHeadline.Prop>Votes: {votes}</NewsHeadline.Prop>
              <NewsHeadline.Prop active={!!selected}>
                {selected ? "SELCTED" : "Not Selected"}
              </NewsHeadline.Prop>
            </NewsHeadline.PropsWrapper>
          </NewsHeadline>
        ))}
      </main>
    </Layout>
  );
}
