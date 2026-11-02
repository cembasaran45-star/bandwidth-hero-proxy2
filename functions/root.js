/**
 * Site root ("/").
 *
 * People often paste the bare site URL into the extension instead of
 * ".../api/index". The extension checks that the response body is exactly
 * "bandwidth-hero-proxy", so a static landing page here fails that check.
 *
 * This function makes the root URL a working proxy endpoint too:
 *   - browsers navigating to "/" (Accept: text/html, no url param) get the landing page
 *   - everything else (extension checks, image requests) goes to the proxy handler
 */

const { handler: proxy } = require("./index");

const LANDING_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bandwidth Hero Proxy</title>
</head>
<body>
    <div class="container">
        <h1>Bandwidth Hero Proxy</h1>
        <p>Welcome to the Bandwidth Hero Proxy!</p>
        <p>To use the proxy in the Bandwidth Hero / Bandwidth Guardian extension, follow these steps:</p>
        <ol>
            <li>Open the extension settings.</li>
            <li>Set the Proxy / Data Compression Service URL to <code>https://your-netlify-domain.netlify.app/api/index</code> (the bare site URL also works).</li>
            <li>Save the settings and you are good to go!</li>
        </ol>
        <p>For more information and the source code, visit the <a href="https://github.com/himshim/bandwidth-hero-proxy2">GitHub repository</a>.</p>
    </div>
</body>
</html>`;

exports.handler = async (e) => {
  const params  = e.queryStringParameters || {};
  const headers = e.headers || {};
  const accept  = headers.accept || headers.Accept || "";

  if (!params.url && e.httpMethod !== "OPTIONS" && accept.includes("text/html")) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8", "Vary": "Accept" },
      body: LANDING_PAGE,
    };
  }

  const res = await proxy(e);
  if (!params.url) {
    res.headers = { ...res.headers, "Vary": "Accept" };
  }
  return res;
};
