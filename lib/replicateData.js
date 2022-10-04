import { replicateClient } from "@/services/replicateClient";
const modelVersion = process.env.REPLICATE_MODEL_VERSION;

let count;
export const getReplicateImage = async (replicateImageIdentifier, isInit) => {
  if (isInit) {
    count = 0;
  }

  return new Promise(async (resolve, reject) => {
    count++;
    try {
      const retUrlResponse = await replicateClient.get(replicateImageIdentifier);
      if (retUrlResponse.output) {
        return resolve(retUrlResponse.output[0]);
      }
    } catch (e) {
      return reject(e);
    }
    if (count > 10) {
      return reject("Timed out (10s)");
    }
    setTimeout(async () => {
      const resp = await getReplicateImage(replicateImageIdentifier).catch(reject);
      resolve(resp)
    }, 1000);
  });
};

export const sendReplicateData = ({prompt}) => {
  return replicateClient.post("", {
    body: { 
      version: modelVersion,
      input: {
        prompt: `"Alan Lee" fantasy "oil painting" ${prompt}`
      }
    }
  });
};