import { useState } from "react";
import styles from "./SignUp.module.css";
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  TextField,
  FormControlLabel,
  Radio,
  Typography,
  Link,
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { useRouter } from "next/router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [radioVal, setRadioVal] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignUp = async () => {
    if (email.length === 0 || password.length === 0) {
      setError("Please enter both email and password!");
      return;
    }
    if (validateEmail(email) == null) {
      setError("Please provide a valid email address!");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role: radioVal }),
    });
    if (!res.ok) {
      setError("User with this email already exists!");
      setLoading(false);
    } else {
      setEmail("");
      setPassword("");
      router.push("/sign-in");
    }
  };

  return (
    <div className={styles.signup_wrapper}>
      <div className={styles.signup_form}>
        <Typography
          className={styles.signup_header}
          variant="h4"
          color={"black"}
        >
          Create a new account <MedicalInformationIcon fontSize="large" />
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

        <FormControl className={styles.signup_radio}>
          <FormLabel style={{ color: "black" }}>Your role:</FormLabel>
          <RadioGroup
            row
            value={radioVal}
            onChange={(e) => setRadioVal(e.target.value)}
          >
            <FormControlLabel
              style={{ color: "black" }}
              value="patient"
              control={<Radio />}
              label="Patient"
            />
            <FormControlLabel
              style={{ color: "black" }}
              value="doctor"
              control={<Radio />}
              label="Doctor"
            />
          </RadioGroup>
        </FormControl>

        <Button
          disabled={loading ? true : false}
          variant="contained"
          onClick={handleSignUp}
        >
          {loading ? "Processing ..." : "Sign Up"}
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
          onClick={() => router.push("/sign-in")}
        >
          Sign In instead?
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
