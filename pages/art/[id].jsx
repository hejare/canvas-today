/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { backendClient } from "@/services/backendClient";
import Layout from "@/components/Layout";
import ImageCard from "@/components/molecules/ImageCard";
import ArtImage from "@/components/molecules/ArtImage";
import { STATUS_OK_TEXT } from "@/services/responseConstants";
import { IgnoreException, InstanceNotFoundError } from "@/lib/error";
import { useAsyncCallback } from "@/hooks/useAsyncCallback";

const STATUS_ART_INITIATING = "STATUS_ART_INITIATING";
const STATUS_ART_READY = "STATUS_ART_READY";
// const STATUS_ART_PENDING = "STATUS_ART_PENDING";
// const STATUS_ART_SUCCESS = "STATUS_ART_SUCCESS";
const STATUS_MINT_INITIATING = "STATUS_MINT_INITIATING";
const STATUS_MINT_READY = "STATUS_MINT_READY";
const STATUS_MINT_PENDING = "STATUS_MINT_PENDING";
const STATUS_MINT_ERROR = "STATUS_MINT_ERROR";
// const STATUS_MINT_SUCCESS = "STATUS_MINT_SUCCESS";

export default function ArtPage() {
  const router = useRouter();
  const { id } = router.query;

  const [art, setArt] = useState();
  const [nft, setNft] = useState();
  const [artStatus, setArtStatus] = useState(STATUS_ART_INITIATING);
  const [mintStatus, setMintStatus] = useState(STATUS_MINT_INITIATING);
  const [mintablesLeft, setMintablesLeft] = useState(-1);
  const [artExistInContract, setArtExistInContract] = useState();

  useEffect(() => {
    async function getArt() {
      const responseArt = await backendClient.get(`art/${id}`);
      setArt(responseArt.result);

      const { nftId } = responseArt.result;
      if (nftId) {
        try {
          const responseNft = await backendClient.get(`nft/${nftId}`);
          setNft(responseNft.result);
        } catch (e) {
          if (e instanceof InstanceNotFoundError) {
            await uploadImageAndCreateNftDb(responseArt.result);
          }
        }
      } else {
        await uploadImageAndCreateNftDb(responseArt.result);
      }

      setArtStatus(STATUS_ART_READY);
    }
    getArt();
  }, []);

  const uploadImageAndCreateNftDb = async (freshArt) => {
    const {
      imageUrl,
      seed,
      date,
      headline,
      prompt,
      version,
      model,
      modelVersion,
    } = freshArt;

    const meta = {
      artId: id,
      imageUrl,
      headline,
      seed,
      date,
      prompt,
      version,
      model,
      modelVersion,
      // include "MAX_SUPPLY"?
    };
    const storeFileResponse = await backendClient.post("ipfs/store-file", {
      body: {
        imageUrl,
        meta,
      },
    });

    const { ipfsUrl, cid } = storeFileResponse.result;

    const createResult = await backendClient.post("nft", {
      body: {
        ipfsUrl,
        cid,
        artId: id,
        prompt,
        version,
        model,
        modelVersion,
        seed,
        headline,
        date,
        imageUrl,
      },
    });

    setNft(createResult.result);

    // Now lets update art with the nft db-reference:
    await backendClient.put(`art/${id}`, {
      body: {
        ...art,
        nftId: createResult.result.id,
      },
    });
  };

  const [mintNft, isMinting] = useAsyncCallback({
    callback: async () => {
      if (mintStatus === STATUS_MINT_PENDING) {
        console.log("Minting in progress...");
        return;
      }
      setMintStatus(STATUS_MINT_PENDING);

      console.log({ artExistInContract });
      if (artExistInContract === false) {
        await addArtToSmartContract();
      }

      console.log("lets do mint!");
      const mintResponse = await backendClient.post("hre/nft/mint", {
        body: { artId: art.id },
      });
      console.log("mintResponse:", mintResponse);
      if (mintResponse.status === STATUS_OK_TEXT) {
        await backendClient.put(`nft/${nft.id}`, {
          body: {
            ...nft,
            mintedCount: nft.mintedCount + 1,
          },
        });
      }
      // check transaction here: https://goerli.etherscan.io/tx/${mintResponse.result.hash}
      setMintStatus(STATUS_MINT_READY);
    },
    onError: (e) => {
      console.log("ok, we got an error:", e);
      setMintStatus(STATUS_MINT_ERROR);
    },
  });

  const addArtToSmartContract = async () => {
    console.log("Lets add this art to the contract:", nft);
    const backendResponseAddArt = await backendClient.post("hre/art", {
      body: {
        metaUrl: nft.ipfsUrl,
        artId: nft.artId,
      },
    });
    setArtExistInContract(true);

    console.log("backendResponseAddArt:", backendResponseAddArt);
    const updatedNft = {
      ...nft,
      // TODO: Add the tokenId here!!!!!
      mintedCount: 0,
    };
    await backendClient.put(`nft/${nft.id}`, {
      body: updatedNft,
    });
    setNft(updatedNft);
  };

  useEffect(() => {
    async function getArtDataFromContract(artId) {
      try {
        const response = await backendClient.get(`hre/art/${artId}`);
        setMintablesLeft(5 - response.result[0]);
        setArtExistInContract(true);
      } catch (e) {
        setMintablesLeft(5);
        setArtExistInContract(false);
        IgnoreException(e);
      }
      setMintStatus(STATUS_MINT_READY);
    }
    getArtDataFromContract(id);
  }, []);

  if (artStatus === STATUS_ART_INITIATING) {
    return <>Loading...</>;
  }

  const { headline, votes, date, imageUrl, seed, selected } = art;

  let ipfsImageSrc;
  if (nft?.meta?.image) {
    // TODO: The image url should be fetched from the smart contract
    console.log("nft.meta.image:", nft.meta.image);
    ipfsImageSrc = `/api/ipfs/image?src=${encodeURIComponent(nft.meta.image)}`;
  }

  return (
    <Layout
      title={`Art ${id}`}
      description="This art was generated by an AI with the input of an wordly event of its date. Now embrace its uniquenes and become its owner!"
    >
      <main style={{ padding: 16, textAlign: "-webkit-center" }}>
        <ImageCard key={id}>
          <ImageCard.Heading>{headline}</ImageCard.Heading>
          <ImageCard.Image>
            <ArtImage
              imageUrl={ipfsImageSrc || imageUrl}
              alt={headline}
              size="available"
              ipfs={!!ipfsImageSrc}
            />
          </ImageCard.Image>
          <ImageCard.PropsWrapper>
            <ImageCard.ButtonProp
              onClick={mintNft}
              disabled={
                mintablesLeft === 0 || mintStatus === STATUS_MINT_PENDING
              }
              loading={mintStatus === STATUS_MINT_PENDING || isMinting}
              indicate={mintStatus === STATUS_MINT_ERROR ? "error" : ""}
            >
              Mint NFT
              <br />
              {mintablesLeft > -1 ? `(${mintablesLeft} of 5 left)` : ""}
            </ImageCard.ButtonProp>
            <ImageCard.SelectProp
              type="art"
              id={id}
              selected={selected}
              closed={true}
            />
            <ImageCard.VoteProp
              type="art"
              id={id}
              votes={votes}
              closed={true}
            />
            <ImageCard.Prop>{seed}</ImageCard.Prop>
            <ImageCard.Prop>{date}</ImageCard.Prop>
          </ImageCard.PropsWrapper>
        </ImageCard>
        <section>
          <div>
            If the art above has a green left border, it is an healthy
            indication of it being hosted on the decetralized ipfs network. If
            not, a red thin border is shown.
          </div>
        </section>
      </main>
    </Layout>
  );
}
