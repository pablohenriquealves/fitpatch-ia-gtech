import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { workoutRouter } from "./server/routes/workout";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "fitpatch-ia" });
});

app.use("/api/workout", workoutRouter);

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  const { createServer } = await import("vite");
  const vite = await createServer({
    server: { middlewareMode: true, host: "0.0.0.0", port },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
);

app.listen(port, "0.0.0.0", () => {
  console.log(`FitPatch IA listening on http://0.0.0.0:${port}`);
});
