import express from "express";

import flightRoutes from "./src/routes/flightRoutes.js";
import attractionRoutes from "./src/routes/attractionRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use("/", flightRoutes);
app.use("/", attractionRoutes);
app.use("/", searchRoutes);

app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ status: false, message: err.message || "Server error" });
});


// Start HTTP server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
