import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Import styles của Mantine (Bắt buộc)
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Định nghĩa Theme: Chúng ta sẽ dùng tông màu xanh (Blue) professional
const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md', // Bo góc vừa phải, chuyên nghiệp
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark"> {/* Mặc định dùng Dark Mode */}
      <Notifications position="top-right" zIndex={1000} />
      <App />
    </MantineProvider>
  </React.StrictMode>,
)