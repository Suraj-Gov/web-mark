const chromium = require("chrome-aws-lambda");

exports.handler = async (event, context, callback) => {
  let browser = null;
  let imgBuffer = null;
  let pageTitle = null;

  const { pageUrl, userId } = JSON.parse(event.body);

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();
    await page.goto(pageUrl);

    imgBuffer = await page.screenshot({ encoding: "binary" });
    pageTitle = await page.title();
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      imgBuffer,
      pageTitle,
    }),
  };
};
