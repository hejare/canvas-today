import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "components/Layout";

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
      <main>
        {headlines.map(({ headline, votes, selected, id }) => (
          <div key={id}>
            <b>{headline}</b>
            <br /> VOTES: [{votes}] SELECTED: {selected ? "TRUE" : "FALSE"}
            <br />
            <br />
          </div>
        ))}
      </main>
    </Layout>
  );
}
