import { useState } from "react";
import styles from "./SignIn.module.css";
import { Button, Link, TextField, Typography } from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { auth, signInWithEmailAndPassword } from "../firebase/config";
import { useRouter } from "next/router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      setError("Please enter both email and password!");
      return;
    }
    if (validateEmail(email) == null) {
      setError("Please provide a valid email address!");
      return;
    }

    setLoading(true);
    try {
      const signIn = await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem("user", `${signIn.user.email}`);
      router.push("/forum");
    } catch (err) {
      setError("Wrong email and/or password!");
      setLoading(false);
    }
  };

  return (
    <div className={styles.signin_wrapper}>
      <div className={styles.signin_form}>
        <Typography
          className={styles.signin_header}
          variant="h4"
          color={"black"}
        >
          Sign In <MedicalInformationIcon fontSize="large" />
        </Typography>

        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          label="Email"
          required
          fullWidth
        />
        <TextField
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          label="Password"
          required
          fullWidth
        />

        <Button
          disabled={loading ? true : false}
          variant="contained"
          onClick={handleSignIn}
        >
          {loading ? "Processing ..." : "Sign In"}
        </Button>
        {error && error.length !== 0 && (
          <Typography
            variant="body1"
            color={"red"}
            style={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push("/sign-up")}
        >
          New user? Sign Up now
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
