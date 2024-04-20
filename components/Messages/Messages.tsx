import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import styles from "./Messages.module.css";
import React, { useState } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";

export type MessageProp = {
  sender: string;
  role: string;
  text?: string;
  image?: string[];
  createdAt: FieldValue;
};

type MessageViewProp = {
  messages: MessageProp[];
  selectedThreadTopic: string;
  selectedThreadID: string;
  userRole: string;
};

const Messages = ({
  messages,
  selectedThreadTopic,
  selectedThreadID,
  userRole,
}: MessageViewProp) => {
  const [imgModal, setImgModal] = useState(false);
  const [imgModalSrc, setImgModalSrc] = useState("");

  const [inputVal, setInputVal] = useState("");
  const [uploadedImgsURLs, setUploadedImgsURLs] = useState<string[]>([]);
  const userEmail = sessionStorage.getItem("user");

  const [errorAlertAppear, setErrorAppear] = useState(false);
  const [sendingStatus, setSendingStatus] = useState(false);
  const errorAlert = (
    <Alert
      className={styles.errorAlert}
      variant="filled"
      severity="error"
      onClose={() => setErrorAppear(false)}
    >
      Message cannot be empty!
    </Alert>
  );

  const handleSend = async () => {
    if (inputVal.length === 0 && uploadedImgsURLs.length === 0) {
      setErrorAppear(true);
      return;
    }
    setSendingStatus(true);
    setErrorAppear(false);
    const subCollectionRef = collection(
      db,
      "threads",
      selectedThreadID,
      "messages"
    );
    const messageData: MessageProp = {
      sender: userEmail as string,
      role: userRole,
      text: inputVal,
      createdAt: serverTimestamp(),
      image: uploadedImgsURLs,
    };
    await addDoc(subCollectionRef, messageData);
    setSendingStatus(false);
    setInputVal("");
    setUploadedImgsURLs([]);
  };

  const [imgUploadModal, setUploadModal] = useState(false);
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
    p: 2,
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "18px",
  };

  const uploadedImgModalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [selectedImgPaths, setSelectedImgPath] = useState<File[]>([]);
  const [uploadingImgStatus, setUploadingImgStatus] = useState(false);

  const handleSelectIMGs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      setSelectedImgPath((prev) => [...prev, files[i]]);
      let image = document.createElement("img");
      image.src = URL.createObjectURL(files[i]);
      image.width = 150;
      document.querySelector(".uploadedImgs")?.appendChild(image);
    }
  };
  const handleUploadImg = async (event: any) => {
    event.preventDefault();
    setUploadingImgStatus(true);
    const cloudinaryUploadURL =
      "https://api.cloudinary.com/v1_1/damlauel2/image/upload";
    const formData = new FormData();
    for (let i = 0; i < selectedImgPaths.length; i++) {
      formData.append("file", selectedImgPaths[i]);
      formData.append("upload_preset", "tzvp7l1j");
      const res = await fetch(cloudinaryUploadURL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const secureURL = data.secure_url;
      setUploadedImgsURLs((prev) => [...prev, secureURL]);
    }
    setUploadingImgStatus(false);
    setUploadModal(false);
  };

  const attachedImgsAlert = (
    <Alert
      className={styles.attachedImgsNotify}
      variant="filled"
      severity="success"
      action={
        <Button
          color="inherit"
          size="small"
          onClick={() => setUploadedImgsURLs([])}
        >
          Remove
        </Button>
      }
    >
      {`${uploadedImgsURLs.length} image(s) attached. Add text or send`}
    </Alert>
  );

  return (
    <div className={styles.messagesViewWapper}>
      <Typography variant="h6" color={"black"} className={styles.threadTopic}>
        {selectedThreadTopic}
      </Typography>
      <div className={styles.messages}>
        {messages.map((message) => (
          <div
            key={message.text}
            className={`${styles.messageContent} ${
              message.sender === userEmail && styles.myMessages
            }`}
          >
            <Typography
              variant="caption"
              color={message.sender === userEmail ? "#1976d2" : undefined}
              fontWeight={message.sender === userEmail ? "bold" : undefined}
            >
              {message.sender === userEmail
                ? "You"
                : `${message.sender} (${message.role})`}
            </Typography>
            {message.text?.length !== 0 && (
              <Typography variant="body1">{message.text}</Typography>
            )}
            {message.image?.length !== 0 && (
              <div className={styles.imgGroup}>
                {message.image?.map((i) => (
                  <>
                    <img
                      src={i}
                      alt="Uploaded img"
                      style={{
                        maxWidth: "150px",
                        height: "auto",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setImgModal(true);
                        setImgModalSrc(i);
                      }}
                    />
                  </>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        open={imgModal}
        onClose={() => setImgModal(false)}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box sx={uploadedImgModalStyle}>
          <img
            src={imgModalSrc}
            alt="Uploaded img"
            style={{ maxWidth: "80dvw", maxHeight: "80dvh" }}
          />
        </Box>
      </Modal>

      <div className={styles.input}>
        <IconButton
          color="primary"
          size="large"
          onClick={() => setUploadModal(true)}
        >
          <ImageIcon fontSize="inherit" />
        </IconButton>

        <Modal
          open={imgUploadModal}
          onClose={() => {
            setUploadModal(false);
            setSelectedImgPath([]);
          }}
        >
          <Box sx={modalStyle}>
            <IconButton
              color="primary"
              size="large"
              disabled={uploadingImgStatus}
              onClick={() => {
                setUploadModal(false);
                setSelectedImgPath([]);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
            <form method="post" encType="multipart/form-data">
              <input
                type="file"
                accept="image/*"
                multiple
                name="files[]"
                onChange={handleSelectIMGs}
              />
              <Button
                size="small"
                type="submit"
                disabled={selectedImgPaths.length === 0 || uploadingImgStatus}
                onClick={handleUploadImg}
                variant="contained"
                endIcon={<UploadIcon />}
              >
                {uploadingImgStatus ? "Processing..." : "Attach to message"}
              </Button>
            </form>
            <div
              className="uploadedImgs"
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "6px",
                maxWidth: "90%",
                overflowX: "auto",
              }}
            ></div>
          </Box>
        </Modal>

        <TextField
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          multiline
          maxRows={5}
          fullWidth
          variant="outlined"
          label="Send a message"
        />
        {errorAlertAppear && errorAlert}
        {uploadedImgsURLs.length !== 0 && attachedImgsAlert}
        <IconButton
          disabled={sendingStatus}
          color="primary"
          size="large"
          onClick={handleSend}
        >
          {sendingStatus ? (
            <BlockIcon fontSize="inherit" />
          ) : (
            <SendIcon fontSize="inherit" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default Messages;
