const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

app.setName("tldrq");

if (app.dock && !app.isPackaged) {
  app.dock.setIcon(path.join(__dirname, "icon.icns"));
}

const SITE_URL = "https://tldrq.com";
const PROTOCOL = "tldrq";

// Register as handler for tldrq:// URLs
if (process.defaultApp) {
  app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [
    path.resolve(process.argv[1]),
  ]);
} else {
  app.setAsDefaultProtocolClient(PROTOCOL);
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(SITE_URL);

  // Intercept navigations to Supabase auth — open in system browser
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.includes("supabase.co/auth")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(SITE_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

// Handle tldrq:// URL (macOS: open-url event)
app.on("open-url", (event, url) => {
  event.preventDefault();
  handleProtocolUrl(url);
});

function handleProtocolUrl(url) {
  // tldrq://auth/callback?access_token=...&refresh_token=...
  const parsed = new URL(url);
  if (parsed.hostname === "auth" || parsed.pathname.startsWith("/auth")) {
    const accessToken = parsed.searchParams.get("access_token");
    const refreshToken = parsed.searchParams.get("refresh_token");
    if (accessToken && refreshToken && mainWindow) {
      mainWindow.loadURL(
        `${SITE_URL}/auth/desktop?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`
      );
      mainWindow.focus();
    }
  }
}

app.whenReady().then(createWindow);

// macOS: re-create window when dock icon is clicked
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
