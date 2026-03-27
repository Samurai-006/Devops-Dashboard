const backendBaseUrl = process.env.SMOKE_BACKEND_URL || "http://backend:5000";
const frontendBaseUrl = process.env.SMOKE_FRONTEND_URL || "http://frontend:3000";
const maxAttempts = Number(process.env.SMOKE_MAX_ATTEMPTS || 12);
const retryDelayMs = Number(process.env.SMOKE_RETRY_DELAY_MS || 5000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.text();
}

async function waitFor(checkFn, description) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await checkFn();
      console.log(`PASS: ${description}`);
      return;
    } catch (error) {
      lastError = error;
      console.log(`Retry ${attempt}/${maxAttempts} for ${description}: ${error.message}`);
      if (attempt < maxAttempts) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw new Error(`Smoke test failed for ${description}: ${lastError.message}`);
}

async function run() {
  await waitFor(async () => {
    const message = await fetchText(`${backendBaseUrl}/`);
    if (!message.includes("DevOps Dashboard Backend Running")) {
      throw new Error("Backend root response did not contain expected banner");
    }
  }, "backend root endpoint");

  await waitFor(async () => {
    const deployments = await fetchJson(`${backendBaseUrl}/deployments`);
    if (!Array.isArray(deployments) || deployments.length === 0) {
      throw new Error("Deployments response was empty");
    }
  }, "backend deployments endpoint");

  await waitFor(async () => {
    const health = await fetchJson(`${backendBaseUrl}/health`);
    if (health.backend !== "Running" || health.frontend !== "Running") {
      throw new Error("Health endpoint did not report running services");
    }
  }, "backend health endpoint");

  await waitFor(async () => {
    const page = await fetchText(frontendBaseUrl);
    if (!page.includes("DevOps Dashboard")) {
      throw new Error("Frontend page did not contain dashboard title");
    }
  }, "frontend homepage");

  console.log("Smoke regression tests passed.");
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
