import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

type ThreadItem = {
  createdBy: string;
  createdByRole: string;
  topic: string;
  threadID: string;
};

type ThreadProps = {
  threads: ThreadItem[];
  onThreadClick: (threadID: string, threadTopic: string) => void;
};

const Thread = ({ threads, onThreadClick }: ThreadProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "white",
        maxHeight: "90dvh",
        overflowY: "auto",
      }}
    >
      {threads.length !== 0 && (
        <List style={{ padding: 0 }}>
          {threads.map((item) => (
            <>
              <Divider style={{ border: "2px dashed #1976d2" }} />
              <ListItem disablePadding key={item.threadID}>
                <ListItemButton
                  onClick={() => onThreadClick(item.threadID, item.topic)}
                >
                  <ListItemText
                    style={{ color: "black" }}
                    primary={item.topic}
                    secondary={`Created by ${item.createdByRole} ${item.createdBy}`}
                  />
                </ListItemButton>
              </ListItem>
            </>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Thread;
