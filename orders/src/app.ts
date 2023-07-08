import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler,NotFoundError, currentUser} from "@ticketingxnie/common";
import cookieSession from "cookie-session";
import { deleteOrdersRouter } from "./routes/delete";
import { indexOrdersRouter } from "./routes";
import { newOrdersRouter } from "./routes/new";
import { showOrdersRouter } from "./routes/show";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser)
app.use(deleteOrdersRouter);
app.use(indexOrdersRouter);
app.use(newOrdersRouter)
app.use(showOrdersRouter)
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);


export { app };
