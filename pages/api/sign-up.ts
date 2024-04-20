import { NextApiRequest, NextApiResponse } from "next";
import { collection, addDoc } from "firebase/firestore";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
} from "../../firebase/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, password, role } = req.body;
      await createUserWithEmailAndPassword(auth, email, password);

      const usersCollection = collection(db, "users");
      const userData = {
        email,
        role,
      };
      await addDoc(usersCollection, userData);

      res.status(201).json({
        message: `A new ${role} account has been created!`,
      });
    } catch (error) {
      res.status(400).json({
        message: error,
      });
    }
  }
}
