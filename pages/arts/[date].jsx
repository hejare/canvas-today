import { useEffect, useState } from "react";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import ImageCard from "@/components/molecules/ImageCard";
import ArtImage from "@/components/molecules/ArtImage";
import {
  PROCESS_ART_SELECT_ENDTIME,
  PROCESS_ART_VOTE_ENDTIME,
} from "@/lib/slack";
import { getToday, isTimePassed, ONE_MINUTE_IN_MS } from "@/lib/common";
import { useInterval } from "usehooks-ts";
import { useRouter } from "next/router";
import ArtsPageNav from "@/components/molecules/ArtsPageNav";

export default function ArtsPage() {
  const router = useRouter();
  const { date } = router.query;

  const [arts, setArts] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [votingEnded, setVotingEnded] = useState(
    isTimePassed(PROCESS_ART_VOTE_ENDTIME),
  );
  const [selectingEnded, setSelectingEnded] = useState(
    isTimePassed(PROCESS_ART_SELECT_ENDTIME),
  );

  useInterval(
    () => {
      if (isTimePassed(PROCESS_ART_VOTE_ENDTIME)) {
        setVotingEnded(true);
      }
    },
    votingEnded ? null : ONE_MINUTE_IN_MS,
  );

  useInterval(
    () => {
      if (isTimePassed(PROCESS_ART_SELECT_ENDTIME)) {
        setSelectingEnded(true);
      }
    },
    selectingEnded ? null : ONE_MINUTE_IN_MS,
  );

  useEffect(() => {
    async function getArts(date) {
      const response = await backendClient.get("art", {
        params: { date },
      });
      const fetchedArts = response.result.sort((a, b) => b.votes - a.votes);
      const selectedArt = fetchedArts.find((fetchedArt) => fetchedArt.selected);
      if (selectedArt) {
        setSelectedId(selectedArt.id);
      }
      setArts(fetchedArts);
    }
    getArts(date);
  }, [date]);

  const isToday = getToday() === date;
  return (
    <Layout
      title="Arts"
      description="Todays selected headline will output arts to this page, for some evaluation before being defined as Todays Art!"
    >
      <main style={{ padding: 16, textAlign: "-webkit-center" }}>
        <ArtsPageNav date={date} />
        {isToday && (
          <>
            {votingEnded && (
              <div style={{ border: "1px solid red" }}>Voting is closed</div>
            )}
            {selectingEnded && (
              <div style={{ border: "1px solid red" }}>Selecting is closed</div>
            )}
            <div style={{ border: "1px solid white" }}>
              Todays voting is open until {PROCESS_ART_VOTE_ENDTIME}, and the
              ability to select ends {PROCESS_ART_SELECT_ENDTIME}
            </div>
          </>
        )}
        {arts.map(({ headline, votes, id, imageUrl, prompt, seed }) => (
          <ImageCard key={id}>
            <ImageCard.Heading>{headline}</ImageCard.Heading>
            <ImageCard.Image>
              <ArtImage imageUrl={imageUrl} alt={headline} size="available" />
            </ImageCard.Image>
            <ImageCard.PropsWrapper>
              <ImageCard.Prop>{prompt.replace(headline, "")}</ImageCard.Prop>
              <ImageCard.Prop>{seed}</ImageCard.Prop>
              <ImageCard.VoteProp
                type="art"
                id={id}
                votes={votes}
                closed={votingEnded}
              />
              <ImageCard.SelectProp
                type="art"
                id={id}
                selected={selectedId === id}
                closed={selectingEnded}
                onSelect={setSelectedId}
              />
            </ImageCard.PropsWrapper>
          </ImageCard>
        ))}
      </main>
    </Layout>
  );
}
