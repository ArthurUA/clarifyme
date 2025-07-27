let prompts = [];

document.addEventListener("DOMContentLoaded", async () => {
  const inputText = document.getElementById("inputText");
  const clarifyBtn = document.getElementById("clarifyBtn");
  const modeSelect = document.getElementById("modeSelect");
  const outputBox = document.getElementById("outputBox");

  // Load prompts (modes)
  const res = await fetch("prompts/modes.json");
  prompts = await res.json();

  clarifyBtn.disabled = true;

  // Enable/disable button on input
  inputText.addEventListener("input", () => {
    clarifyBtn.disabled = inputText.value.trim().length === 0;
  });

  // Button click logic
  clarifyBtn.addEventListener("click", async () => {
    const userText = inputText.value.trim();
    const modeId = modeSelect.value;

    const mode = prompts.find((p) => p.id === modeId);
    if (!mode) {
      updateOutput("⚠️ Error: Mode not found.");
      return;
    }

    if (!userText) {
      updateOutput("⚠️ Please enter your text.");
      return;
    }

    const finalPrompt = `${mode.prompt}\n\n${userText}`;
    updateOutput("⏳ Thinking...");

    try {
      const aiAnswer = await fetchAIResponse(finalPrompt);
      updateOutput(aiAnswer);
    } catch (err) {
      console.error(err);
      updateOutput("❌ Error while contacting AI.");
    }
  });
});

// Connects to Gemma via OpenRouter (text completion)
async function fetchAIResponse(prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",  // ⛔️ ВСТАВЬ СЮДА СВОЙ API КЛЮЧ
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemma-3-4b-it:free",
      prompt: prompt,
      max_tokens: 800,
      temperature: 0.7
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.text?.trim() || "🤖 No response.";
}

// Renders result
function updateOutput(text) {
  const outputText = document.getElementById("outputText");
  const outputBox = document.getElementById("outputBox");

  outputText.textContent = "";
  const span = document.createElement("span");
  span.textContent = text;
  outputText.appendChild(span);

  if (text.trim().length > 0) {
    outputBox.classList.add("has-content");
  } else {
    outputBox.classList.remove("has-content");
  }
}
