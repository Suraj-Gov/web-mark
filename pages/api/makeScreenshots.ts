import { NextApiRequest, NextApiResponse } from "next";
const playwright = require("playwright-aws-lambda");
const fs = require("fs");

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const browser = await playwright.launchChromium({ headless: true });
    const context = await browser.newContext();
    let { pageUrl, userId } = req.body;
    // if there is an existing user, go ahead
    const page = await context.newPage();
    try {
      await page.goto(pageUrl);
    } catch (err) {
      // if there is an error in going to the page, error out
      console.log(err.message);
      res.status(403).send("ERROR");
      return;
      // } finally {
      //   if (browser !== null) {
      //     await browser.close();
      //   }
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
    res.send({
      imagePath: `${pathForImage}/${filename}`,
      pageTitle,
    });
  }
}
