import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

import { validateRequest } from "zod-express-middleware";

import { sendOkResponse } from "./utils/sendOkResponse.js";
import { sendServerError } from "./utils/sendServerError.js";

import bot from "./bot.js";

configDotenv();

const chatID = process.env.CHAT_WITH_BOT_ID;

const app = express();
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND],
    optionsSuccessStatus: 200,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.post(
  "/contact",
  validateRequest({
    body: z.object({
      name: z
        .string()
        .regex(
          new RegExp("^[a-zA-Zа-яА-ЯёЁіІїЇєЄўЎćĆńŃśŚźŹżŻłŁąĄęĘóÓ]+$"),
          "Name: Only A-Z"
        )
        .min(2, { message: "Min length 2" })
        .max(20, { message: "Max length 20" }),
      phone: z.string().refine((value) => isValidPhoneNumber(value), {
        message: "phone invalid",
      }),
      message: z.string().max(5000, { message: "message max 5000" }),
    }),
  }),
  (req, res) => {
    try {
      bot.sendMessage(
        chatID,
        `<strong>Нова заявка із сайту!</strong>\n\n<strong>Імʼя:</strong> ${
          req.body.name
        }\n<strong>Номер телефону:</strong> ${
          req.body.phone
        }\n\n<strong>Додаткова інформація:</strong> ${
          req.body.message ? req.body.message : "<code>Не надано.</code>"
        }`,
        {
          parse_mode: "HTML",
        }
      );
      sendOkResponse(res, "nice");
    } catch (error) {
      sendServerError(res, error);
    }
  }
);

app.use((req, res, next) => {
  const error = {
    status: 404,
    message: "Route not found",
  };
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log("ERROR", error);
  res.json({
    error: {
      message: error.message,
      status: error.status,
    },
  });
});

app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`);
});
