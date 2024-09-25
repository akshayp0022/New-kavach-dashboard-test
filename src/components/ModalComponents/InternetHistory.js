import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';

const InternetHistory = ({ employeeId }) => {
  const [browserHistory, setBrowserHistory] = useState([]);

  // Dummy function to simulate fetching browser history
  const handleGetBrowserHistory = () => {
    // Example data
    const dummyData = [
      { url: 'https://example.com', title: 'Example Website', visit_count: 5 },
      { url: 'https://another.com', title: 'Another Website', visit_count: 3 },
    ];
    setBrowserHistory(dummyData);
  };

  return (
    <div>
      <Button onClick={handleGetBrowserHistory}>
        Get Browser History for Employee {employeeId}
      </Button>

      {/* Display browser history */}
      <div>
        {browserHistory.length > 0 ? (
          <Box
            sx={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px',
              marginTop: '10px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6">Browser History</Typography>
            <List>
              {browserHistory.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`URL: ${item.url}`}  // Adjust this if your item structure is different
                      secondary={`Title: ${item.title} - Visit Count: ${item.visit_count}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Box>
        ) : (
          <Typography>No browser history available.</Typography>
        )}
      </div>
    </div>
  );
};

export default InternetHistory;
