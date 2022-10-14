import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import NewsHeadline from "@/components/molecules/NewsHeadline";
import {
  PROCESS_HEADLINE_SELECT_ENDTIME,
  PROCESS_HEADLINE_VOTE_ENDTIME,
} from "@/lib/slack";
import { isTimePassed } from "@/lib/common";
import useInterval from "@/hooks/useInterval";

const ONE_MINUTE_IN_MS = 60000;

export default function HeadlinesPage() {
  const [headlines, setHeadlines] = useState([]);
  const [votingEnded, setVotingEnded] = useState(
    isTimePassed(PROCESS_HEADLINE_VOTE_ENDTIME),
  );
  const [selectingEnded, setSelectingEnded] = useState(
    isTimePassed(PROCESS_HEADLINE_SELECT_ENDTIME),
  );

  useInterval(
    () => {
      if (isTimePassed(PROCESS_HEADLINE_VOTE_ENDTIME)) {
        setVotingEnded(true);
      }
    },
    votingEnded ? null : ONE_MINUTE_IN_MS,
  );

  useInterval(
    () => {
      if (isTimePassed(PROCESS_HEADLINE_SELECT_ENDTIME)) {
        setSelectingEnded(true);
      }
    },
    selectingEnded ? null : ONE_MINUTE_IN_MS,
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
        {headlines.map(({ headline, votes, selected, id }) => (
          <NewsHeadline key={id}>
            <NewsHeadline.Heading>{headline}</NewsHeadline.Heading>
            <NewsHeadline.PropsWrapper>
              <NewsHeadline.VoteProp
                id={id}
                votes={votes}
                closed={votingEnded}
              />
              <NewsHeadline.SelectProp
                id={id}
                selected={selected}
                closed={selectingEnded}
              />
            </NewsHeadline.PropsWrapper>
          </NewsHeadline>
        ))}
      </main>
    </Layout>
  );
}
