import fs from "fs";

import { db } from "../../server/firebase";
import { getCurratedGamesSnapshot } from "./get-games";
import { getConfigDoc } from "./get-config";

import { Storage } from "@google-cloud/storage";

const bundleId = "launch-bundle";
const bundleDestFileName = "launch-bundle.txt";
const bucketName = "pocket-party-images";

export default async function handler(req, res) {
  const [
    curratedGames,
    curratedGamesOrder,
    filtersOrder,
    displayFilters,
    googleAds,
    featureFlags,
  ] = await Promise.all([
    getCurratedGamesSnapshot(),
    getConfigDoc("currated-games"),
    getConfigDoc("filters-order"),
    getConfigDoc("display-filters"),
    getConfigDoc("google-ads"),
    getConfigDoc("feature-flags"),
  ]);

  const bundle = db.bundle(bundleId);
  const bundleBuffer = bundle
    .add(curratedGamesOrder)
    .add(filtersOrder)
    .add(displayFilters)
    .add(googleAds)
    .add(featureFlags)
    .add("currated-games", curratedGames)
    .build();

  const ws = fs.createWriteStream("./launch-bundle.txt");
  ws.write(bundleBuffer);
  ws.end();

  ws.on("finish", async () => {
    // Creates a client
    const storage = new Storage();

    const options = {
      destination: bundleDestFileName,
      gzip: true,
    };

    await storage.bucket(bucketName).upload("./launch-bundle.txt", options);
    fs.unlinkSync("./launch-bundle.txt");

    res.status(200).json({ status: "DONE" });
  });
}
