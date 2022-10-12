import { backendClient } from "@/services/backendClient";
import { useEffect, useState } from "react";

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
    <div>
      <div>
        <h1>TODAYS HEADLINES:</h1>
      </div>
      {headlines.map(({ headline, votes, selected, id }) => (
        <div key={id}>
          <b>{headline}</b>
          <br /> VOTES: [{votes}] SELECTED: {selected ? "TRUE" : "FALSE"}
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
