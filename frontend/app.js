const form = document.querySelector("#bug-form");
const fileInput = document.querySelector("#bug-file");
const fileName = document.querySelector("#file-name");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");
const resultsSection = document.querySelector("#results-section");

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

fileInput.addEventListener("change", () => {
  fileName.textContent = fileInput.files?.[0]?.name || "";
  message.textContent = "";
  message.className = "form-message";
});

function sourceCard(source, count) {
  const config = {
    mozilla: { label: "Mozilla", tracker: "Bugzilla", symbol: "M", style: "" },
    apache: { label: "Apache", tracker: "Jira", symbol: "A", style: "apache" },
    eclipse: { label: "Eclipse", tracker: "Bugzilla", symbol: "E", style: "eclipse" },
  }[source];
  if (!config) return "";
  return `<article class="source-card"><span class="source-symbol ${config.style}">${config.symbol}</span><div><strong>${config.label}</strong><small>${config.tracker}</small></div><b>${Number(count).toLocaleString()}</b></article>`;
}

async function refreshIndex() {
  const connection = document.querySelector("#connection");
  const ready = document.querySelector("#kb-ready");
  try {
    const [healthResponse, statsResponse] = await Promise.all([fetch("/api/health"), fetch("/api/stats")]);
    const health = await healthResponse.json();
    const stats = statsResponse.ok ? await statsResponse.json() : null;
    const dbReady = health.status === "ready";
    connection.className = `connection ${dbReady ? "ok" : "error"}`;
    connection.querySelector("span").textContent = dbReady ? "Index connected" : "Index unavailable";
    ready.className = `kb-ready ${dbReady ? "ok" : "error"}`;
    ready.innerHTML = `<i></i>${dbReady ? `${Number(stats?.defects || 0).toLocaleString()} indexed defects` : "Index unavailable"}`;
    if (stats) {
      document.querySelector("#nav-count").textContent = Number(stats.defects).toLocaleString();
      const counts = Object.fromEntries((stats.sources || []).map((item) => [item.source, item.defects]));
      document.querySelector("#source-grid").innerHTML = ["mozilla", "apache", "eclipse"].map((source) => sourceCard(source, counts[source] || 0)).join("");
    }
  } catch {
    connection.className = "connection error";
    connection.querySelector("span").textContent = "API unavailable";
    ready.className = "kb-ready error";
    ready.innerHTML = "<i></i>Backend unavailable";
  }
}

function resultMarkup(result) {
  const source = String(result.source || "").toLowerCase();
  const sourceLabel = { mozilla: "Mozilla", apache: "Apache", eclipse: "Eclipse" }[source] || source;
  const status = [result.status, result.resolution].filter(Boolean).join(" · ");
  const meta = [result.product, result.component, status].filter(Boolean).map((value) => `<span>${escapeHtml(value)}</span>`).join("");
  const similarity = Number(result.cosine_similarity || 0);
  return `<article class="result-card">
    <div class="result-top"><div class="result-source"><span class="source-pill ${escapeHtml(source)}">${escapeHtml(sourceLabel)}</span><span>${escapeHtml(result.external_id)}</span></div><span class="result-score">${similarity.toFixed(3)} cosine</span></div>
    <h3>${escapeHtml(result.summary || "Untitled issue")}</h3>
    <p>${escapeHtml(result.matched_excerpt || result.description || "No public description was available.").slice(0, 540)}${String(result.matched_excerpt || result.description || "").length > 540 ? "…" : ""}</p>
    <div class="result-meta">${meta}</div>
    <a class="result-link" href="${escapeHtml(result.source_url)}" target="_blank" rel="noreferrer">Open original issue ↗</a>
  </article>`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const description = document.querySelector("#bug-description").value.trim();
  const file = fileInput.files?.[0];
  if (!description && !file) {
    message.textContent = "Add issue details or attach a supported text file.";
    message.className = "form-message";
    return;
  }

  const body = new FormData();
  body.append("title", document.querySelector("#bug-title").value.trim());
  body.append("description", description);
  if (file) body.append("file", file);
  submitButton.disabled = true;
  submitButton.innerHTML = "Searching public history <span>…</span>";
  message.textContent = "";
  message.className = "form-message";

  try {
    const response = await fetch("/api/submit", { method: "POST", body });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.detail || "Search could not be completed.");
    const results = Array.isArray(payload.results) ? payload.results : [];
    document.querySelector("#results-count").textContent = `${results.length} ${results.length === 1 ? "match" : "matches"}`;
    document.querySelector("#metric-note").textContent = payload.metric_note;
    const list = document.querySelector("#results-list");
    if (results.length) {
      list.innerHTML = results.map(resultMarkup).join("");
    } else {
      list.innerHTML = `<div class="empty-results"><strong>No similar indexed issues found.</strong><br />This report was not saved. Ask an administrator to ingest the public Mozilla, Apache and Eclipse sources, or try adding a clearer summary, error message or reproduction step.</div>`;
    }
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    message.textContent = "Search complete. Your submitted text was not retained.";
    message.className = "form-message success";
  } catch (error) {
    message.textContent = error.message;
    message.className = "form-message";
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = "Find similar issues <span>↗</span>";
  }
});

refreshIndex();
