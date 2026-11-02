const { handler } = require("../functions/index");
const { test, expect } = require("@jest/globals");

test("handler returns correct response when no url query parameter is provided", async () => {
  const event = {
    queryStringParameters: {},
  };

  const response = await handler(event);

  expect(response.statusCode).toBe(200);
  expect(response.body).toBe("bandwidth-hero-proxy");
});

test("handler tolerates missing queryStringParameters", async () => {
  const response = await handler({ headers: {} });
  expect(response.statusCode).toBe(200);
  expect(response.body.trim()).toBe("bandwidth-hero-proxy");
});

const { handler: rootHandler } = require("../functions/root");

test("root returns identity string for extension checks", async () => {
  const response = await rootHandler({ queryStringParameters: {}, headers: { accept: "*/*" } });
  expect(response.statusCode).toBe(200);
  expect(response.body.trim()).toBe("bandwidth-hero-proxy");
});

test("root returns landing page for browsers", async () => {
  const response = await rootHandler({ queryStringParameters: {}, headers: { accept: "text/html,*/*" } });
  expect(response.statusCode).toBe(200);
  expect(response.body).toContain("<h1>Bandwidth Hero Proxy</h1>");
});
