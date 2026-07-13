let scanner = null;
let scannerRunning = false;

const nameInput = document.getElementById("name");
const itemInput = document.getElementById("item");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const submitBtn = document.getElementById("submitBtn");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status" + (type ? ` ${type}` : "");
}

function startScanner() {
  if (scannerRunning) return;

  setStatus("Starting camera...");
  scanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10,
      qrbox: { width: 220, height: 220 },
      rememberLastUsedCamera: true
    },
    false
  );

  scanner.render(onScanSuccess, onScanFailure);
  scannerRunning = true;
}

function stopScanner() {
  if (scanner) {
    scanner.clear().catch(() => {});
  }
  scanner = null;
  scannerRunning = false;
  setStatus("Scanner stopped.");
}

function onScanSuccess(decodedText) {
  itemInput.value = decodedText.trim();
  setStatus(`QR scanned: ${decodedText}`, "ok");
  stopScanner();
}

function onScanFailure(error) {
}

async function submitWithdraw() {
  const name = nameInput.value.trim();
  const item = itemInput.value.trim();

  if (!name) {
    setStatus("Please enter your name.", "err");
    return;
  }

  if (!item) {
    setStatus("Please scan an item QR code first.", "err");
    return;
  }

  submitBtn.disabled = true;
  setStatus("Submitting...");

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxeJPQfLaekRGXk8bZPh1BP9psM_UC3Nyib0mzydnGPfXWwXj01gG04mafosqI6SP1Y/exec", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({
        name,
        item
      })
    });

    const result = await response.json();

    if (result.success) {
      setStatus(result.message || "Withdraw successful.", "ok");
      nameInput.value = "";
      itemInput.value = "";
    } else {
      setStatus(result.message || "Submission failed.", "err");
    }
  } catch (error) {
    setStatus("Network or server error.", "err");
  } finally {
    submitBtn.disabled = false;
  }
}

startBtn.addEventListener("click", startScanner);
stopBtn.addEventListener("click", stopScanner);
submitBtn.addEventListener("click", submitWithdraw);
