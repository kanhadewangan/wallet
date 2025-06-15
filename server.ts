import express from "express"
import route from "./backend/user";
import post from "./backend/post";
import payment from "./backend/payment";
import { transaction } from "./backend/transaction";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'auth']
}));

app.use(express.json());
app.use("/user", route)
app.use("/post", post);
app.use("/transfer", transaction)
app.use("/payments", payment)
app.listen(3000, () => {
    console.log("started at 3000");
})