import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import NewsHeadline from "@/components/molecules/NewsHeadline";
import {
  PROCESS_HEADLINE_SELECT_ENDTIME,
  PROCESS_HEADLINE_VOTE_ENDTIME,
} from "@/lib/slack";
import { getToday } from "@/lib/common";

function isTimePassed(timeToCheck) {
  // timeToCheck in format: HH:mm
  const today = getToday();
  const dateString = `${today}T${timeToCheck}:00`;
  const endTimestamp = new Date(dateString).getTime();
  return endTimestamp < Date.now();
}

export default function HeadlinesPage() {
  const [headlines, setHeadlines] = useState([]);
  const [votingEnded, setVotingEnded] = useState(
    isTimePassed(PROCESS_HEADLINE_VOTE_ENDTIME),
  );
  const [selectingEnded, setSelectingEnded] = useState(
    isTimePassed(PROCESS_HEADLINE_SELECT_ENDTIME),
  );

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
        {votingEnded && (
          <div style={{ border: "1px solid red" }}>Voting is closed</div>
        )}
        {selectingEnded && (
          <div style={{ border: "1px solid red" }}>Selecting is closed</div>
        )}
        <div style={{ border: "1px solid white" }}>
          Todays voting is open until {PROCESS_HEADLINE_VOTE_ENDTIME}, and the
          ability to select ends {PROCESS_HEADLINE_SELECT_ENDTIME}
        </div>
        {headlines.map(({ headline, votes, selected, id }, idx) => (
          <NewsHeadline key={id}>
            <NewsHeadline.Heading>{headline}</NewsHeadline.Heading>
            <NewsHeadline.PropsWrapper>
              <NewsHeadline.VoteProp id={id} votes={votes} />
              <NewsHeadline.SelectProp id={id} selected={selected} />
            </NewsHeadline.PropsWrapper>
          </NewsHeadline>
        ))}
      </main>
    </Layout>
  );
}
