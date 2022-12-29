import IconButton from "@/components/atoms/IconButton";
import GenerateArtModal from "@/components/molecules/GenerateArtModal";
import { memo } from "react";
import styled from "styled-components";
import { useModal } from "use-modal-hook";

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
  font-size: 0.8em;
  z-index: 3;
  width: inherit;
  height: inherit;
  display: flex;
  align-items: center;
  flex-flow: row;
  justify-content: space-around;
  position: absolute;
  padding: 4px;
`;

const GenerateArtButton = ({ headlineId, className }) => {
  const TheGenerateArtModal = memo(function MemoGenerateArtModal({
    isOpen,
    onClose,
  }) {
    return (
      <GenerateArtModal
        isOpen={isOpen}
        onClose={onClose}
        headlineId={headlineId}
      />
    );
  });

  const [showGenerateArtModal] = useModal(TheGenerateArtModal, {});

  return (
    <VoteWrapper closed={closed} className={className}>
      <Voter>
        <IconButton onClick={showGenerateArtModal}>
          <span style={{ color: "black" }}>Go!</span>
        </IconButton>
      </Voter>
      <StyledPropSpan>Generate Art</StyledPropSpan>
    </VoteWrapper>
  );
};

export default GenerateArtButton;
