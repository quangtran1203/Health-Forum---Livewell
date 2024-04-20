import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Health Forum</title>
        <meta name="description" content="health forum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Box
          component="div"
          sx={{ p: 2, border: "1px dashed grey", fontSize: "18px" }}
        >
          Health Forum for Patients and Doctors
        </Box>
        <div className={styles.btnGroup}>
          <Button
            variant="outlined"
            size="large"
            style={{
              fontWeight: "bold",
            }}
            onClick={() => router.push("/sign-in")}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            size="large"
            style={{
              fontWeight: "bold",
            }}
            onClick={() => router.push("/sign-up")}
          >
            Sign Up
          </Button>
        </div>
      </main>
    </>
  );
}
