import { NextApiRequest, NextApiResponse } from "next";
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const fs = require("fs");

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { pageUrl, userId } = req.body;
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
    ignoreHTTPSErrors: true,
  });
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
  } finally {
    if (browser !== null) {
      await browser.close();
    }
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
    imgPath: `${pathForImage + "/" + filename}`,
  });
}
