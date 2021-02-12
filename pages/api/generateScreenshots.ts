// https://firebase.google.com/docs/firestore/quickstart#node.js
// https://github.com/alixaxel/chrome-aws-lambda
// https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-on-aws-lambda
import { NextApiRequest, NextApiResponse } from "next";
import "firebase/firestore";
import admin from "firebase-admin";
import fs from "fs";
import config from "../../constants/firebaseService";
import cloudinary from "cloudinary";
import Vibrant from "node-vibrant";
import axios from "axios";
admin.apps.length === 0 &&
  admin.initializeApp({
    // @ts-ignore
    credential: admin.credential.cert(config),
  });
const db = admin.firestore();
cloudinary.v2.config({
  cloud_name: "suraj-gov-cloudinary",
  api_key: "595953576716982",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // sudo apt-get install libnss3-dev
    let { pageUrl, userId } = req.body;
    if (pageUrl && userId) {
      const existingUser = await db
        .collection("users")
        .where("uid", "==", userId)
        .get();
      // check for existing user
      if (!existingUser.empty) {
        const { data } = await axios.post(
          process.env.NODE_ENV === "production"
            ? "https://web-mark.netlify.app/api/makeScreenshots"
            : "http://localhost:3000/api/makeScreenshots",
          {
            userId,
            pageUrl,
          }
        );
        console.log(data);
        let color;
        // detect vibrant light color
        Vibrant.from(data.imagePath).getPalette((error, palette) => {
          color = palette.LightVibrant;
        });
        let imageURL = "";
        // upload the image to cloudinary
        await cloudinary.v2.uploader.upload(
          data.imagePath,
          {
            folder:
              process.env.NODE_ENV === "production"
                ? "web-mark-prod"
                : "web-mark-test/",
            public_id: data.imagePath.slice(-30),
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              res.status(401).send("ERROR");
              return;
            }
            imageURL = result.secure_url;
          }
        );
        if (imageURL !== "" || color) {
          fs.unlink(data.imagePath, () => {});
          const result = {
            status: "success",
            pageTitle: data.pageTitle,
            imageURL,
            color,
            url: pageUrl,
            timestamp: admin.database.ServerValue.TIMESTAMP,
          };
          res.send(result);
          //delete the image
        }
      } else {
        res.status(401).send("UNAUTHORIZED");
        return;
      }
    } else {
      res.status(403).send("UNKNOWN PARAMS");
      return;
    }
  }
}
