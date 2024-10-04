import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';

const KeyloggerHistory = ({ employeeId }) => {
  const [keyLogs, setKeyLogs] = useState([]);

  // Dummy function to simulate fetching key logs
  const handleGetKeyLogs = () => {
    const dummyKeyLogs = [
      { content: 'Example key log 1', timestamp: Date.now() },
      { content: 'Example key log 2', timestamp: Date.now() - 60000 },
    ];
    setKeyLogs(dummyKeyLogs);
  };

  return (
    <div>
      <Button onClick={handleGetKeyLogs}>
        Get Keylogger Data
      </Button>

      <Box
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          marginTop: '10px',
        }}
      >
        {keyLogs.length > 0 ? (
          <List>
            {keyLogs.map((log, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`Log: ${log.content}`} 
                    secondary={`Logged at: ${new Date(log.timestamp).toLocaleString()}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>No key logs available.</Typography>
        )}
      </Box>
    </div>
  );
};

export default KeyloggerHistory;
