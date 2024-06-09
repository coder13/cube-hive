import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { WCA_CLIENT_ID, WCA_ORIGIN, WCA_CLIENT_SECRET } from "./env";
import { buildPayload, signToken } from "./jwt";
import { Profile, Tokens } from "./types";

console.log(WCA_ORIGIN, WCA_CLIENT_ID, WCA_CLIENT_SECRET);
const port = 8080;
const REDIRECT_URI = `http://localhost:${port}/auth/callback`;

const app = express();

app.use(cors<cors.CorsRequest>());
app.use(json());

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.get("/auth/login", (req, res) => {
  const urlSearchParams = new URLSearchParams({
    client_id: WCA_CLIENT_ID,
    client_secret: WCA_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "public email dob manage_competitions",
  });

  res.redirect(`${WCA_ORIGIN}/oauth/authorize?${urlSearchParams}`);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  console.log("Code: ", code);

  const tokensRes = await fetch(`${WCA_ORIGIN}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: WCA_CLIENT_ID,
      client_secret: WCA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokensRes.ok) {
    res.status(500).send("Failed to get tokens");
    return;
  }

  const tokensJson = (await tokensRes.json()) as Tokens;

  console.log(tokensJson);

  const profileRes = await fetch(`${WCA_ORIGIN}/api/v0/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokensJson.access_token}`,
    },
  });

  const profile = (await profileRes.json()) as Profile;

  const jwtToken = signToken(buildPayload(tokensJson, profile));

  res.json({ jwt: jwtToken });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
