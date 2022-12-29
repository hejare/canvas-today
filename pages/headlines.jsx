import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import NewsHeadline from "@/components/molecules/NewsHeadline";
import {
  PROCESS_HEADLINE_SELECT_ENDTIME,
  PROCESS_HEADLINE_VOTE_ENDTIME,
} from "@/lib/slack";
import { isTimePassed, ONE_MINUTE_IN_MS } from "@/lib/common";
import useInterval from "@/hooks/useInterval";

export default function HeadlinesPage() {
  const [headlines, setHeadlines] = useState([]);
  const [selectedId, setSelectedId] = useState();
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
      const fetchedHeadlines = response.result.sort(
        (a, b) => b.votes - a.votes,
      );
      const selectedHeadline = fetchedHeadlines.find(
        (fetchedHeadline) => fetchedHeadline.selected,
      );
      if (selectedHeadline) {
        setSelectedId(selectedHeadline.id);
      }
      setHeadlines(fetchedHeadlines);
    }
    getHeadlines();
  }, []);

  return (
    <Layout
      title="Headlines"
      description="Current headlines from todays events are listed below. Voting and ultimately, selecting one of these - outputs versions of arts."
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
        {headlines.map(({ headline, votes, id }) => (
          <NewsHeadline key={id}>
            <NewsHeadline.Heading>{headline}</NewsHeadline.Heading>
            <NewsHeadline.PropsWrapper>
              <NewsHeadline.VoteProp
                type="headline"
                id={id}
                votes={votes}
                closed={votingEnded}
              />
              <NewsHeadline.SelectProp
                type="headline"
                id={id}
                selected={selectedId === id}
                closed={selectingEnded}
                onSelect={setSelectedId}
              />
              <NewsHeadline.GenerateArt headlineId={id} />
            </NewsHeadline.PropsWrapper>
          </NewsHeadline>
        ))}
      </main>
    </Layout>
  );
}
