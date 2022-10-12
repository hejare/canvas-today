import { backendClient } from "@/services/backendClient";
import { useEffect, useState } from "react";

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
    <div>
      <div>
        <h1>TODAYS ARTS:</h1>
      </div>
      {arts.map(({ headline, votes, selected, id, imageUrl, seed }) => (
        <div key={id}>
          <b>{headline}</b> ({seed})<br />
          <img src={imageUrl} alt={headline} /> <br /> VOTES: [{votes}]
          SELECTED: {selected ? "TRUE" : "FALSE"}
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
