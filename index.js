const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default,
  { getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");

const { AzureKeyCredential } = require("@azure/core-auth");

const { setLogLevel } = require("@azure/logger");
const fs = require('fs');
const path = require('path');

setLogLevel("info");

// set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
const key = "";
const endpoint = "";

// sample document
const baseUrl = "https://homepage.ntu.edu.tw/~r13922a13/h/%E7%B5%84%E5%90%88%201_%E9%A0%81%E9%9D%A2_";
const fileExtension = ".jpg";

async function main() {
  const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

  for (let i = 1; i <= 1764; i++) {//1764
    const pageNumber = i.toString().padStart(4, '0');
    const formUrl = `${baseUrl}${pageNumber}${fileExtension}`;

    const initialResponse = await client
      .path("/documentModels/{modelId}:analyze", "prebuilt-layout")
      .post({
        contentType: "application/json",
        body: {
          urlSource: formUrl
        },
      });

    if (isUnexpected(initialResponse)) {
      throw initialResponse.body.error;
    }

    const poller = await getLongRunningPoller(client, initialResponse);
    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    // Convert URL to base64
    const base64Url = Buffer.from(formUrl).toString('base64');
    const fileName = `${base64Url}.json`;

    // Save analyzeResult to a JSON file
    fs.writeFileSync(path.join(__dirname, fileName), JSON.stringify(analyzeResult, null, 2));

    console.log(`Analyze result for ${formUrl} saved to ${fileName}`);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
