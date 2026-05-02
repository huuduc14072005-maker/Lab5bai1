// src/pages/Symmetric.jsx
import { useState } from 'react';
import {
  Title,
  Container,
  Paper,
  Group,
  Text,
  Select,
  TextInput,
  Textarea,
  Button,
  SegmentedControl,
  ActionIcon,
  CopyButton,
  rem,
  Alert,
  SimpleGrid
} from '@mantine/core';

import { ShieldCheck, Clipboard, Zap, AlertCircle } from 'lucide-react';
import { notifications } from '@mantine/notifications';

import { generateRandomKey, symmetricProcess } from '../utils/symmetricCrypto';

function Symmetric() {
  const [algorithm, setAlgorithm] = useState('AES');
  const [action, setAction] = useState('encrypt');

  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');

  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateKey = () => {
    const result = generateRandomKey(algorithm);
    setKey(result.key);
    notifications.show({
      title: 'Thành công!',
      message: `Đã tạo khóa ${algorithm} (${result.key.length * 4} bits)`,
      color: 'teal',
    });
  };

  const handleExecute = () => {
    if (!inputText.trim()) {
      setError('Vui lòng nhập dữ liệu!');
      return;
    }
    if (!key) {
      setError('Vui lòng tạo hoặc nhập Secret Key!');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutputText('');

    const result = symmetricProcess(action, algorithm, 'ECB', inputText, key);

    setTimeout(() => {
      if (result.success) {
        setOutputText(result.result);
        notifications.show({
          title: action === 'encrypt' ? 'Mã hóa thành công' : 'Giải mã thành công',
          message: result.algorithm,
          color: 'green',
        });
      } else {
        setError(result.error);
        notifications.show({ title: 'Lỗi', message: result.error, color: 'red' });
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <Container size="xl" py="lg">
      <Group mb="lg" gap="xs">
        <ShieldCheck size={36} color="#339af0" />
        <Title order={1}>Symmetric Encryption Tool</Title>
      </Group>

      <Paper shadow="md" radius="md" padding="xl" withBorder>
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
          <Select
            label="1. Thuật toán"
            data={['AES', '3DES', 'DES']}
            value={algorithm}
            onChange={setAlgorithm}
          />
          <Select
            label="Chế độ (Mode)"
            data={['ECB']}
            value="ECB"
            disabled
          />
        </SimpleGrid>

        <Group ta="center" mb="lg">
          <SegmentedControl
            fullWidth
            size="md"
            color="blue"
            value={action}
            onChange={setAction}
            data={[
              { label: '🔓 Encrypt', value: 'encrypt' },
              { label: '🔐 Decrypt', value: 'decrypt' },
            ]}
          />
        </Group>

        <Textarea
          label={`2. ${action === 'encrypt' ? 'Plaintext' : 'Ciphertext'}`}
          placeholder="Nhập nội dung..."
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.currentTarget.value)}
          mb="lg"
        />

        <TextInput
          label="3. Secret Key (Hex)"
          placeholder="Nhấn Auto Generate để tạo khóa..."
          value={key}
          onChange={(e) => setKey(e.currentTarget.value)}
          mb="xl"
          rightSectionWidth={160}
          rightSection={
            <Button 
              onClick={handleGenerateKey} 
              variant="light" 
              color="blue" 
              leftSection={<Zap size={16} />}
            >
              Auto Generate
            </Button>
          }
        />

        <Button
          onClick={handleExecute}
          fullWidth
          size="md"
          color="blue"
          loading={isLoading}
        >
          {action === 'encrypt' ? '🔒 Mã hóa' : '🔓 Giải mã'}
        </Button>

        {error && (
          <Alert icon={<AlertCircle size={16} />} color="red" mt="md" title="Lỗi">
            {error}
          </Alert>
        )}

        {outputText && (
          <Paper shadow="sm" radius="md" padding="md" withBorder mt="xl">
            <Group position="apart" mb={8}>
              <Text fw={500}>
                Kết quả ({action === 'encrypt' ? 'Ciphertext' : 'Plaintext'}):
              </Text>
              <CopyButton value={outputText}>
                {({ copied, copy }) => (
                  <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                    <Clipboard size={rem(18)} />
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
            <Textarea value={outputText} readOnly rows={6} variant="filled" />
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default Symmetric;