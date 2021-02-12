import { NextApiRequest, NextApiResponse } from "next";
const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const fs = require("fs");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { pageUrl, userId } = req.body;
  if (!pageUrl || !userId) {
    res.status(403).end("ERROR");
    return;
  }
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === "production" && {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    }
  );
  const page = await browser.newPage();
  try {
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    });
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
      pageTitle,
    });
  } catch (err) {
    console.log(err.message);
    res.status(403).end("ERROR");
    return;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
