import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "components/Layout";

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
      <main>
        {arts.map(({ headline, votes, selected, id, imageUrl, seed }) => (
          <div key={id}>
            <b>{headline}</b> ({seed})<br />
            <img src={imageUrl} alt={headline} /> <br /> VOTES: [{votes}]
            SELECTED: {selected ? "TRUE" : "FALSE"}
            <br />
            <br />
          </div>
        ))}
      </main>
    </Layout>
  );
}
