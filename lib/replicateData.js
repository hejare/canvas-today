import { replicateClient } from "@/services/replicateClient";
const modelVersion = process.env.REPLICATE_MODEL_VERSION;

export const createPrompt = (
  inputPrompt,
  artist = "Alan Lee", // or Claude Monet
  type = "oil painting",
) => `"${artist}" "${type}" ${inputPrompt}`;

export const getUrlResponse = async (replicateImageIdentifier) => {
  const retUrlResponse = await replicateClient.get(
    `/${replicateImageIdentifier}`,
  );
  if (retUrlResponse.output) {
    return {
      imageUrl: retUrlResponse.output[0],
      seed: retUrlResponse.logs.split("\n")[0],
    };
  }
  return false;
};

export const sendReplicateData = ({ prompt, seed }) => {
  return replicateClient.post("", {
    body: {
      version: modelVersion,
      input: {
        prompt: prompt,
        seed,
      },
    },
  });
};
