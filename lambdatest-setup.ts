/**
 * Add the file in your test suite to run tests on LambdaTest.
 * Import `test` object from this file in the tests.
 */

import * as base from "@playwright/test";
import path from "path";
import { chromium } from "playwright";

// LambdaTest capabilities
const capabilities = {
  browserName: "Chrome", // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
  browserVersion: "latest",
  "LT:Options": {
    platform: "Windows 10",
    build: "Playwright Build",
    name: "Playwright Test",
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
    tunnel: false, // Add tunnel configuration if testing locally hosted webpage
    tunnelName: "", // Optional
    geoLocation: "", // country code can be fetched from https://www.lambdatest.com/capabilities-generator/
  },
};

// Patching the capabilities dynamically according to the project name.
const modifyCapabilities = (configName, testName) => {
  let config = configName.split("@lambdatest")[0];
  let [browserName, browserVersion, platform] = config.split(":");
  capabilities.browserName = browserName
    ? browserName
    : capabilities.browserName;
  capabilities.browserVersion = browserVersion
    ? browserVersion
    : capabilities.browserVersion;
  capabilities["LT:Options"]["platform"] = platform
    ? platform
    : capabilities["LT:Options"]["platform"];
  capabilities["LT:Options"]["name"] = testName;
};

const getErrorMessage = (obj, keys) =>
  keys.reduce(
    (obj, key) => (typeof obj == "object" ? obj[key] : undefined),
    obj
  );

const test = base.test.extend({
  // Do not depend on the default `page` fixture, or Playwright launches a local browser first.
  page: async ({}, use, testInfo) => {
    if (!testInfo.project.name.match(/lambdatest/)) {
      throw new Error(
        `Only LambdaTest projects are supported. Got project "${testInfo.project.name}".`
      );
    }

    const fileName = testInfo.file.split(path.sep).pop();
    modifyCapabilities(
      testInfo.project.name,
      `${testInfo.title} - ${fileName}`
    );

    if (!process.env.LT_USERNAME || !process.env.LT_ACCESS_KEY) {
      throw new Error(
        "LT_USERNAME and LT_ACCESS_KEY must be set to run tests on LambdaTest."
      );
    }

    const browser = await chromium.connect({
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(capabilities)
      )}`,
    });

    const ltPage = await browser.newPage(testInfo.project.use);
    await use(ltPage);

    const testStatus = {
      action: "setTestStatus",
      arguments: {
        status: testInfo.status,
        remark: getErrorMessage(testInfo, ["error", "message"]),
      },
    };
    await ltPage.evaluate(
      () => {},
      `lambdatest_action: ${JSON.stringify(testStatus)}`
    );
    await ltPage.close();
    await browser.close();
  },
});

export default test;
