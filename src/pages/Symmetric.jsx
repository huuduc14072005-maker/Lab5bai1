import { useState } from 'react';
import axios from 'axios';
import { Title, Container, Paper, Group, Text, Select, TextInput, Textarea, Button, SegmentedControl, ActionIcon, CopyButton, rem } from '@mantine/core';
import { ShieldCheck, Clipboard, Zap } from 'lucide-react';
import { notifications } from '@mantine/notifications';

function Symmetric() {
  // State quản lý dữ liệu nhập liệu
  const [algorithm, setAlgorithm] = useState('AES');
  const [mode, setMode] = useState('CBC');
  const [action, setAction] = useState('encrypt'); // 'encrypt' hoặc 'decrypt'
  
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hàm gọi API auto-generate key (Gọi API của Member 2)
  const handleGenerateKey = async () => {
    try {
      // Giả lập gọi API Backend (sẽ thay bằng axios.get...)
      // const response = await axios.get(`http://localhost:5000/api/symmetric/generate-key?algo=${algorithm}`);
      // setKey(response.data.key);
      
      const mockKey = algorithm === 'AES' ? 'random_aes_key_32_bytes' : 'random_des_key_8_bytes';
      setKey(mockKey);
      setError('');
      notifications.show({ title: 'Thành công!', message: 'Đã tạo khóa ngẫu nhiên mới!', color: 'teal', icon: <KeyRound size={18} /> });
    } catch (err) {
      setError('Lỗi khi tạo khóa ngẫu nhiên');
    }
  };

  // Hàm thực thi Mã hóa/Giải mã
  const handleExecute = async () => {
    if (!inputText || !key) {
      setError('Vui lòng nhập đầy đủ Dữ liệu và Khóa!');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setOutputText('');

    try {
      // Gọi API Backend thực tế (Member 2 viết):
      /*
      const response = await axios.post('http://localhost:5000/api/symmetric/process', {
        action: action, algorithm: algorithm, mode: mode, text: inputText, key: key
      });
      setOutputText(response.data.result);
      */

      // Mock data hiển thị tạm thời:
      setTimeout(() => {
        setOutputText(action === 'encrypt' ? 'Mocked_Encrypted_Ciphertext_Base64' : 'Mocked_Decrypted_Plaintext');
        setIsLoading(false);
      }, 700);

    } catch (err) {
      // Bắt lỗi do Member 4 trả về từ Backend
      setError(err.response?.data?.error || 'Đã có lỗi xảy ra.');
      setIsLoading(false);
    }
  };

  return (
    <Container size="xl" py="lg">
      <Group mb="lg" gap="xs">
        <ShieldCheck size={36} color="#339af0" />
        <Title order={1}>Symmetric Encryption Tool</Title>
      </Group>

      <Paper shadow="md" radius="md" padding="xl" withBorder>
        {/* --- Bước 2: Select Algorithm --- */}
        <SimpleGrid cols={{ base: 1, md: 2 }} mb="xl">
          <Select 
            label="1. Chọn Thuật toán"
            data={['DES', '3DES', 'AES']}
            value={algorithm}
            onChange={setAlgorithm}
            allowDeselect={false}
          />
          <Select 
            label="Chế độ hoạt động (Mode)"
            data={['ECB', 'CBC']}
            value={mode}
            onChange={setMode}
            allowDeselect={false}
          />
        </SimpleGrid>

        {/* --- Chọn Encrypt / Decrypt Tab --- */}
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

        {/* --- Bước 3: Input Data --- */}
        <Textarea 
          label={`2. ${action === 'encrypt' ? 'Plaintext' : 'Ciphertext'}:`}
          placeholder={`Nhập ${action === 'encrypt' ? 'văn bản' : 'mã hóa'} của bạn...`}
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          mb="lg"
          error={inputText === '' && error ? true : false}
        />

        {/* --- Bước 4: Key Management --- */}
        <TextInput 
          label="3. Secret Key:"
          placeholder="Nhập khóa bí mật của bạn..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          error={error}
          mb="xl"
          rightSectionWidth={170}
          rightSection={
            <Button.Group>
              <Button onClick={handleGenerateKey} variant="light" color="blue" leftSection={<Zap size={14} />}>Auto-generate</Button>
            </Button.Group>
          }
        />

       {/* --- Bước 5: Execute --- */}
        <Button onClick={handleExecute} fullWidth size="md" color="blue" loading={isLoading}>
          {`Execute ${action.toUpperCase()}`}
        </Button>

        {/* --- Output --- */}
        {outputText && (
          <Paper shadow="sm" radius="md" padding="md" withBorder mt="xl">
            <Textarea 
              label="Kết quả (Output):"
              value={outputText}
              readOnly
              rows={4}
              variant="filled"
              rightSection={
                <CopyButton value={outputText}>
                  {({ copied, copy }) => (
                    <ActionIcon onClick={copy} variant="filled" color={copied ? 'teal' : 'gray'} mt={60} mr={15}>
                      <Clipboard style={{ width: rem(18), height: rem(18) }} />
                    </ActionIcon>
                  )}
                </CopyButton>
              }
            />
          </Paper>
        )}
      </Paper>
    </Container>
  );
}

export default Symmetric;