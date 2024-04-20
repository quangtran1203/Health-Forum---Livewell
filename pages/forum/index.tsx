import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase/config";
import {
  collection,
  where,
  getDocs,
  query,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/router";
import {
  Button,
  Typography,
  Box,
  Modal,
  TextField,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { signOut } from "firebase/auth";
import styles from "./Forum.module.css";
import Thread from "@/components/Threads/Thread";
import Messages, { MessageProp } from "@/components/Messages/Messages";

const Forum = () => {
  const [user] = useAuthState(auth);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [threadTopic, setThreadTopic] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setError("");
    setThreadTopic("");
    setModalOpen(false);
  };

  const handleCreateThread = async () => {
    if (threadTopic.length === 0) {
      setError("Thread topic cannot be empty!");
      return;
    }
    setModalLoading(true);
    setError("");
    const threadsRef = collection(db, "threads");
    const threadData = {
      createdBy: userEmail,
      createdByRole: role,
      topic: threadTopic,
    };
    const docRef = await addDoc(threadsRef, threadData);
    await updateDoc(doc(db, "threads", docRef.id), { threadID: docRef.id });
    setModalLoading(false);
    handleCloseModal();
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };

  const [loadingBackdrop, setLoadingBackdrop] = useState(false);
  const backdrop = (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loadingBackdrop}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  const queryRoleByEmail = async (email: string) => {
    setLoadingBackdrop(true);
    const collectionRef = collection(db, "users");
    const queryRef = query(collectionRef, where("email", "==", email));
    const userInfo = await getDocs(queryRef);
    const userRole = userInfo.docs[0].data().role;
    setRole(userRole);
    setLoadingBackdrop(false);
  };

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");
    if (!user && !userSession) {
      router.push("/sign-in");
    } else {
      setUserEmail(userSession as string);
      queryRoleByEmail(userSession as string);
    }
  }, [user, router]);

  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadTopic, setSelectedThreadTopic] = useState("");
  const [selectedThreadID, setSelectedThreadID] = useState("");
  const [messages, setMessages] = useState<MessageProp[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "threads"), (snapshot) => {
      const threadsData = snapshot.docs.map((docData) => ({
        ...docData.data(),
      })) as any[];
      setThreads(threadsData);
    });
    return () => unsubscribe();
  }, []);

  const handleThreadClick = (threadID: string, threadTopic: string) => {
    setSelectedThreadTopic(threadTopic);
    setSelectedThreadID(threadID);
  };

  useEffect(() => {
    if (selectedThreadID.length !== 0 && selectedThreadTopic.length !== 0) {
      setLoadingBackdrop(true);
      const messagesCollectionRef = collection(
        db,
        "threads",
        selectedThreadID,
        "messages"
      );
      const messagesQuery = query(messagesCollectionRef, orderBy("createdAt"));
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map((m) => ({
          ...m.data(),
        })) as MessageProp[];
        setMessages(messagesData);
        setLoadingBackdrop(false);
      });
      return () => unsubscribe();
    }
  }, [selectedThreadID, selectedThreadTopic]);

  return (
    <div className={styles.wrapper}>
      {backdrop}
      <div className={styles.forumHeader}>
        {userEmail.length !== 0 && (
          <Typography variant="body1">
            {userEmail} ({role})
          </Typography>
        )}
        <Button
          variant="outlined"
          size="large"
          style={{
            fontWeight: "bold",
          }}
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
        >
          Log Out
        </Button>
      </div>

      <div className={styles.chatWrapper}>
        <Box
          component="div"
          className={styles.threads}
          sx={{
            p: 1,
            border: "1px dashed #FFFFF0",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Button
            style={{ marginBottom: "12px" }}
            variant="contained"
            size="medium"
            onClick={handleOpenModal}
          >
            Create a new thread
          </Button>
          <Thread threads={threads} onThreadClick={handleThreadClick} />
        </Box>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ color: "black" }}
            >
              Start a new thread or conversation
            </Typography>
            <TextField
              value={threadTopic}
              onChange={(e) => setThreadTopic(e.target.value)}
              variant="standard"
              multiline
              maxRows={10}
              label="Enter your question/topic"
              fullWidth
            />
            <div className={styles.modalBtn}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                disabled={modalLoading ? true : false}
                variant="contained"
                onClick={handleCreateThread}
              >
                {modalLoading ? "Processing..." : "Create"}
              </Button>
            </div>
            {error.length !== 0 && (
              <Typography variant="body1" color={"red"}>
                {error}
              </Typography>
            )}
          </Box>
        </Modal>

        <Box component="div" className={styles.chats} sx={{ p: 1 }}>
          {selectedThreadTopic.length === 0 ? (
            <Typography variant="body1" color={"black"}>
              Select a thread to view conversations
            </Typography>
          ) : (
            <Messages
              messages={messages}
              userRole={role}
              selectedThreadTopic={selectedThreadTopic}
              selectedThreadID={selectedThreadID}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default Forum;
