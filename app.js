let scanner = null;
let scannerRunning = false;

const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";

const form = document.getElementById("withdrawForm");
const nameInput = document.getElementById("name");
const itemInput = document.getElementById("item");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

form.action = APPS_SCRIPT_URL;

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

form.addEventListener("submit", function (e) {
  const name = nameInput.value.trim();
  const item = itemInput.value.trim();

  if (!name) {
    e.preventDefault();
    setStatus("Please enter your name.", "err");
    return;
  }

  if (!item) {
    e.preventDefault();
    setStatus("Please scan an item QR code first.", "err");
    return;
  }

  setStatus("Submitting...", "ok");
});

startBtn.addEventListener("click", startScanner);
stopBtn.addEventListener("click", stopScanner);
