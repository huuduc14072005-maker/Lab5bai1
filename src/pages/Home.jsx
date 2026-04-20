
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, Hash } from 'lucide-react';
import { Title, Text, SimpleGrid, Card, Group, ThemeIcon, UnstyledButton, Container, rem } from '@mantine/core';

const mockdata = [
  { title: 'Symmetric Encryption', description: 'DES, 3DES, AES - Single key', icon: ShieldCheck, color: 'blue', path: '/symmetric' },
  { title: 'Asymmetric Encryption', description: 'RSA - Key Pair (Public/Private)', icon: KeyRound, color: 'teal', path: '/asymmetric' },
  { title: 'Hash Functions', description: 'MD5, SHA-256 - One-way logic', icon: Hash, color: 'violet', path: '/hash' },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Title ta="center" order={1} mb="xs">Cryptography Toolkit</Title>
      <Text c="dimmed" ta="center" mb={50} size="lg">
        Vui lòng chọn một phương pháp mật mã học từ danh sách bên dưới để bắt đầu.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
        {mockdata.map((item) => (
          <UnstyledButton key={item.title} onClick={() => navigate(item.path)}>
            <Card shadow="md" padding="xl" radius="md" withBorder 
              styles={{ card: { 
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 'var(--mantine-shadow-xl)',
                  borderColor: `var(--mantine-color-${item.color}-filled)`
                }
              } }}>
              <ThemeIcon
                size={50}
                radius={50}
                variant="light"
                color={item.color}
              >
                <item.icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
              </ThemeIcon>
              <Text textTransform="uppercase" fw={700} c="dimmed" size="xs" mt="md">
                Feature Group
              </Text>
              <Text fw={500} size="lg" mt={5}>
                {item.title}
              </Text>
              <Text size="sm" c="dimmed" mt="sm" lh={1.6}>
                {item.description}
              </Text>
            </Card>
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default Home;