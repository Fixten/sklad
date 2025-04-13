import express from "express";
import connectMongo from "./connectMongo";

const app = express();
const port = process.env.BACKEND_PORT;

export const db = await connectMongo().catch(console.error);
console.log(db);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Sklad app listening on port ${port}`);
});
