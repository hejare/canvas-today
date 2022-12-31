import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import Button from "../atoms/Button";
import ErrorMessage from "../atoms/ErrorMessage";
import { backendClient } from "@/services/backendClient";
import { useInterval } from "usehooks-ts";
import ImageCard from "@/components/molecules/ImageCard";

const InfoContainer = styled.div`
  /* height: 100%; */
  font-size: 12px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  place-content: space-between;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  place-content: center;
  /* flex: 1; */
`;

const ButtonsContainer = styled.div`
  width: 100px;
`;
const StyledButton = styled(Button)`
  margin-bottom: 8px;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const RatingContainer = styled.div`
  margin-top: 16px;
  height: 60px;
  position: absolute;
  bottom: 4px;
  right: 20px;
`;

const Info = styled.div``;

const ImageDetails = styled.div`
  padding: 0 4px;
  border-radius: 5px;
  overflow: scroll;
`;

const ImageDetail = styled.span`
  display: block;
`;

const PromptInput = styled.input`
  width: 100%;
`;

const SeedInput = styled.input`
  width: 80px;
`;

const EngineSelector = styled.select`
  width: 50%;
`;

const FIVE_SECONDS_IN_MS = 5000;
const GenerateArtModal = ({ isOpen, onClose, headlineId }) => {
  const [showingImage, setShowingImage] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [headline, setHeadline] = useState(); // TODO: Use redux state and a selector instead!
  const [artId, setArtId] = useState();
  const [interval, setInterval] = useState(null);
  const [imageDetails, setImageDetails] = useState({});
  const [imageUrl, setImageUrl] = useState(
    "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081",
  );
  const [promptDetails, setPromptDetails] = useState({});
  const promptRef = useRef();
  const seedRef = useRef();
  const engineRef = useRef();

  useEffect(() => {
    backendClient
      .get("art", { params: { prompt: 1, headlineId } })
      .then(({ result }) => {
        setPromptDetails({
          ...result,
        });
      })
      .catch((e) => {
        const newError = e.message.error;
        let newErrorMessage = e.message;
        if (newError) {
          newErrorMessage = newError;
        }
        setErrorMessage(newErrorMessage);
      });
  }, [headlineId]);

  useInterval(() => {
    console.log("(INTERVAL running...)");
    setInterval(null);

    backendClient
      .get(`art/${artId}?updateUncompleted=1`)
      .then(({ result }) => {
        setImageDetails({
          headline: result.headline,
          prompt: result.prompt,
          seed: result.seed,
          id: result.id,
          engine: result.engine, // TODO
        });
        if (result.imageUrl === "") {
          setInterval(FIVE_SECONDS_IN_MS);
        } else {
          setImageUrl(result.imageUrl);
        }
      })
      .catch((e) => {
        const newError = e.message.error;
        let newErrorMessage = e.message;
        if (newError) {
          newErrorMessage = newError;
        }
        setErrorMessage(newErrorMessage);
      });
  }, interval);

  const generateArt = () => {
    setErrorMessage();
    console.log({
      headlineId,
      prompt: promptRef.current.value,
      seed: seedRef.current.value,
      engine: engineRef.current.value,
    });
    backendClient
      .post("art", {
        body: {
          headlineId,
          prompt: promptRef.current.value,
          seed: seedRef.current.value,
          engine: engineRef.current.value,
        },
      })
      .then((result) => {
        const { artId } = result;
        console.log(result);
        setArtId(artId);
        setInterval(FIVE_SECONDS_IN_MS);
      })
      .catch((e) => {
        const newError = e.message.error;
        let newErrorMessage = e.message;
        if (newError) {
          newErrorMessage = newError.message.detail;
        }
        setErrorMessage(newErrorMessage);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} enableOnClickOutside>
      <ImageContainer>
        <StyledImage
          src={imageUrl}
          onError={() => {
            setErrorMessage("Art not accessible");
            setShowingImage(false);
          }}
        />
      </ImageContainer>
      <InfoContainer>
        <Info>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <ImageDetails>
            {Object.entries(imageDetails).map(([key, value]) => (
              <ImageDetail key={key}>
                {key}: {value}
              </ImageDetail>
            ))}
          </ImageDetails>
        </Info>
        <PromptInput
          ref={promptRef}
          type="text"
          defaultValue={promptDetails.prompt}
        />
        <span>
          Seed:{" "}
          <SeedInput
            ref={seedRef}
            width="50%"
            type="number"
            defaultValue={promptDetails.seed}
          />
        </span>
        <span>
          AI Engine:
          <EngineSelector ref={engineRef}>
            <option value="REPLICATE">REPLICATE</option>
          </EngineSelector>
        </span>
        <ButtonsContainer>
          <ImageCard.ButtonProp
            onClick={generateArt}
            loading={interval}
            indicate={errorMessage ? "error" : ""}
          >
            Generate!
          </ImageCard.ButtonProp>
        </ButtonsContainer>
      </InfoContainer>
    </Modal>
  );
};
export default GenerateArtModal;
