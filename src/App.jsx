import Asymmetric from './components/Asymmetric';

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AppShell, Burger, Group, Text, NavLink as MantineNavLink, Title, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

// Import Icon từ lucide-react (Lưu ý: dùng Home as HomeIcon để không bị trùng)
import { Home as HomeIcon, ShieldCheck, KeyRound, Hash as HashIcon } from 'lucide-react';

// BẮT BUỘC PHẢI CÓ 2 DÒNG NÀY ĐỂ KÉO GIAO DIỆN CÁC TRANG VÀO:
import Home from './pages/Home';
import Symmetric from './pages/Symmetric';
import Hashing from './pages/Hashing';

// Sửa lại dòng 10 trong mảng navLinks:
const navLinks = [
  { link: '/', label: 'Main Menu', icon: HomeIcon },
  { link: '/symmetric', label: '1. Symmetric Encryption', icon: ShieldCheck },
  { link: '/asymmetric', label: '2. Asymmetric Encryption', icon: KeyRound },
  { link: '/hash', label: '3. Hash Functions', icon: HashIcon },
];

function App() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Router>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        {/* HEADER */}
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <ShieldCheck size={30} color="#339af0" />
            <Title order={3}>Cryptography Toolkit</Title>
          </Group>
        </AppShell.Header>

        {/* NAVBAR (Sidebar) */}
        <AppShell.Navbar p="md">
          <AppShell.Section grow component={ScrollArea}>
            {navLinks.map((item) => (
              <NavLink
                to={item.link}
                key={item.label}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <MantineNavLink
                    component="div"
                    label={item.label}
                    leftSection={<item.icon size="1.2rem" strokeWidth={1.5} />}
                    active={isActive}
                    color="blue"
                    variant="light"
                    mb={4}
                    styles={{
                      label: { fontSize: '1rem', fontWeight: isActive ? 600 : 400 },
                    }}
                  />
                )}
              </NavLink>
            ))}
          </AppShell.Section>

          <AppShell.Section borderTop="1px solid var(--mantine-color-default-border)" pt="md">
            <Text size="xs" c="dimmed" ta="center">
              Fit Project - Class 2024
            </Text>
          </AppShell.Section>
        </AppShell.Navbar>

        {/* MAIN CONTENT */}
        <AppShell.Main bg="var(--mantine-color-body)">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/symmetric" element={<Symmetric />} />

            {/* Tạo file dummy cho 2 trang còn lại để test điều hướng */}
            <Route path="/asymmetric" element={<div p="xl"><Title>Asymmetric (Member 3)</Title></div>} />
            <Route path="/hash" element={<Hashing />} />  

            <Route path="/asymmetric" element={<Asymmetric />} />
            <Route path="/hash" element={<div p="xl"><Title>Hashing (Member 4)</Title></div>} />

          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
}

export default App;