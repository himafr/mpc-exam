import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./src/app.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  console.log(`API base: http://localhost:${PORT}/api/v1`);
});
