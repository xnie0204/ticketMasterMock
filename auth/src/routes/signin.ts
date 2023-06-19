import express, { Request, Response } from "express";
import { body } from "express-validator";
const router = express.Router();
import { validationRequest,BadRequestError  } from "@ticketingxnie/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { password as Password} from "../service/password";
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("you must supply a password"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if(!passwordsMatch) {
      throw new BadRequestError("password is not matched")
    }

     //Generate JWT
     const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    //store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
