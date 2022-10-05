import { replicateClient } from "@/services/replicateClient";
const modelVersion = process.env.REPLICATE_MODEL_VERSION;

export const createPrompt = (inputPrompt) => `"Alan Lee" fantasy "oil painting" ${inputPrompt}`;

const getUrlResponse = async (replicateImageIdentifier) => {
  const retUrlResponse = await replicateClient.get(replicateImageIdentifier);
  if (retUrlResponse.output) {
    return { imageUrl: retUrlResponse.output[0], seed: retUrlResponse.logs.split("\n")[0] };
  }
  return false;
};

let count;
export const getReplicateImage = async (replicateImageIdentifier, isInit) => {
  if (isInit) {
    count = 0;
  }

  return new Promise((resolve, reject) => {
    count++;
    try {
      getUrlResponse(replicateImageIdentifier).then(result => {
        if (result) {
          return resolve(result);
        }
      });
    } catch (e) {
      return reject(e);
    }
    if (count > 20) {
      return reject("Timed out (20s)");
    }
    setTimeout(async () => {
      const resp = await getReplicateImage(replicateImageIdentifier).catch(reject);
      resolve(resp);
    }, 1000);
  });
};

export const sendReplicateData = ({ prompt }) => {
  return replicateClient.post("", {
    body: {
      version: modelVersion,
      input: {
        prompt: prompt,
      },
    },
  });
};