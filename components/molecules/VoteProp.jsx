import { backendClient } from "@/services/backendClient";
import IconButton from "@/components/atoms/IconButton";
import ThumbDownIcon from "@/components/atoms/ThumbDownIcon";
import ThumbUpIcon from "@/components/atoms/ThumbUpIcon";
import { useState } from "react";
import styled from "styled-components";

const VoteWrapper = styled.div`
  display: flex;
  border: 1px solid green;
  height: 64px;
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;

  overflow: hidden;
  background-color: none;
  transition: background-color 0.3s ease-out;
  :hover {
    background-color: ${({ closed }) => (closed ? "inherit" : "white")};
  }

  div {
    position: relative;
    bottom: -64px;
  }
  :hover div {
    bottom: 0;
  }
`;

const Voter = styled.div`
  text-align: center;
  z-index: 4;
  width: inherit;
  height: inherit;
  display: flex;
  flex-direction: row;
  place-content: space-around;
  align-items: center;
  position: absolute;
  background-color: white;
`;

const StyledPropSpan = styled.span`
  z-index: 3;
  width: inherit;
  height: inherit;
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  position: absolute;
  padding: 16px;
`;

const VoteProp = ({ id, votes: initialVotes, closed, type, className }) => {
  const [votes, setVotes] = useState(parseInt(initialVotes, 10));
  const voteUp = async (e) => {
    e.preventDefault();
    if (closed) {
      return;
    }
    await backendClient.get(`${type}/${id}/upvote`);
    setVotes(votes + 1);
  };

  const voteDown = () => {
    if (closed) {
      return;
    }
    backendClient.get(`${type}/${id}/downvote`);
    setVotes(votes - 1);
  };

  return (
    <VoteWrapper closed={closed} className={className}>
      {!closed && (
        <Voter>
          <IconButton onClick={voteUp}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton onClick={voteDown}>
            <ThumbDownIcon />
          </IconButton>
        </Voter>
      )}
      <StyledPropSpan>
        {votes}
        {votes < 0 ? <ThumbDownIcon /> : <ThumbUpIcon />}
      </StyledPropSpan>
    </VoteWrapper>
  );
};

export default VoteProp;
