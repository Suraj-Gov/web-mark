// https://firebase.google.com/docs/firestore/quickstart#node.js
import { NextApiRequest, NextApiResponse } from "next";
import "firebase/firestore";
import puppeteer from "puppeteer";
import admin from "firebase-admin";
import fs from "fs";
import config from "../../constants/firebaseService";
import cloudinary from "cloudinary";
import Vibrant from "node-vibrant";
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
    const browser = await puppeteer.launch();
    let { pageUrl, userId } = req.body;
    if (pageUrl && userId) {
      const existingUser = await db
        .collection("users")
        .where("uid", "==", userId)
        .get();
      // check for existing user
      if (!existingUser.empty) {
        // if there is an existing user, go ahead
        const page = await browser.newPage();
        try {
          await page.goto(pageUrl, {
            waitUntil: "networkidle2",
          });
        } catch (err) {
          // if there is an error in going to the page, error out
          console.log(err.message);
          res.status(403).send("ERROR");
          return;
        }
        const filename = userId.concat(Math.random().toString()) + ".jpg";
        const pathForImage = process.cwd() + "/screenshots";
        !fs.existsSync(pathForImage) && fs.mkdirSync(pathForImage);
        // if the path for images dont exist, make one
        const pageTitle = await page.title();
        // take screenshot
        await page.screenshot({
          path: `${pathForImage + "/" + filename}`,
          quality: 50,
          type: "jpeg",
        });
        let color;
        // detect vibrant light color
        Vibrant.from(pathForImage + "/" + filename).getPalette(
          (error, palette) => {
            color = palette.LightVibrant;
          }
        );
        let imageURL = "";
        // upload the image to cloudinary
        await cloudinary.v2.uploader.upload(
          pathForImage + "/" + filename,
          {
            folder: "web-mark-test/",
            public_id: filename,
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
          fs.unlink(pathForImage + "/" + filename, () => {});
          const result = {
            status: "success",
            pageTitle,
            imageURL,
            color,
            url: pageUrl,
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
