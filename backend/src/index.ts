import "dotenv/config";
import express from "express";
import cors from "cors";
import { workoutRouter } from "./routes/workout.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

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

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
);

app.listen(port, () => {
  console.log(`FitPatch IA ouvindo em http://localhost:${port}`);
});
