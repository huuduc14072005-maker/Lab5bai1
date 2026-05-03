import { useState } from 'react';
import {
  Title, Container, Paper, Group, Text, Select,
  Textarea, Button, ActionIcon, CopyButton, rem,
  Badge, Stack, Divider, Alert, FileInput, Tabs
} from '@mantine/core';
import { Hash, Clipboard, AlertCircle, FileText, Type } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import CryptoJS from 'crypto-js';

// ─── Error Handling Helpers (nhiệm vụ chính của TM4) ───────────────────────

function validateInput(inputText, inputFile, inputMode) {
  if (inputMode === 'text' && !inputText.trim()) {
    return 'Vui lòng nhập văn bản cần băm!';
  }
  if (inputMode === 'file' && !inputFile) {
    return 'Vui lòng chọn file cần băm!';
  }
  return null;
}

function validateAlgorithm(algorithm) {
  const supported = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3'];
  if (!supported.includes(algorithm)) {
    return `Thuật toán "${algorithm}" không được hỗ trợ.`;
  }
  return null;
}

function computeHash(algorithm, message) {
  try {
    switch (algorithm) {
      case 'MD5':     return CryptoJS.MD5(message).toString();
      case 'SHA-1':   return CryptoJS.SHA1(message).toString();
      case 'SHA-256': return CryptoJS.SHA256(message).toString();
      case 'SHA-512': return CryptoJS.SHA512(message).toString();
      case 'SHA-3':   return CryptoJS.SHA3(message).toString();
      default:        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  } catch (err) {
    throw new Error('Lỗi khi tính toán hash: ' + err.message);
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    if (!file) { reject(new Error('Không có file nào được chọn.')); return; }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) { reject(new Error('File quá lớn! Giới hạn 10MB.')); return; }
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result);
    reader.onerror = ()  => reject(new Error('Không thể đọc file. File có thể bị lỗi.'));
    reader.readAsText(file);
  });
}

// ─── Metadata của từng thuật toán ──────────────────────────────────────────

const ALGO_INFO = {
  'MD5':     { bits: 128, color: 'red',    warning: 'Không dùng cho bảo mật (đã bị crack)' },
  'SHA-1':   { bits: 160, color: 'orange', warning: 'Không khuyến nghị cho ứng dụng mới'   },
  'SHA-256': { bits: 256, color: 'teal',   warning: null                                    },
  'SHA-512': { bits: 512, color: 'blue',   warning: null                                    },
  'SHA-3':   { bits: 256, color: 'grape',  warning: null                                    },
};

// ─── Component chính ────────────────────────────────────────────────────────

function Hashing() {
  const [algorithm,  setAlgorithm]  = useState('SHA-256');
  const [inputMode,  setInputMode]  = useState('text');   // 'text' | 'file'
  const [inputText,  setInputText]  = useState('');
  const [inputFile,  setInputFile]  = useState(null);
  const [outputHash, setOutputHash] = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState('');

  const algoInfo = ALGO_INFO[algorithm];

  // ── Xử lý Execute ─────────────────────────────────────────────────────────
  const handleExecute = async () => {
    setError('');
    setOutputHash('');

    // 1. Validate algorithm
    const algoErr = validateAlgorithm(algorithm);
    if (algoErr) { setError(algoErr); return; }

    // 2. Validate input
    const inputErr = validateInput(inputText, inputFile, inputMode);
    if (inputErr) { setError(inputErr); return; }

    setIsLoading(true);
    try {
      let message = '';

      if (inputMode === 'file') {
        message = await readFileAsText(inputFile);
      } else {
        message = inputText;
      }

      // 3. Tính hash
      const hash = computeHash(algorithm, message);
      setOutputHash(hash);

      notifications.show({
        title: 'Hoàn thành!',
        message: `Đã tính ${algorithm} thành công.`,
        color: 'teal',
        icon: <Hash size={18} />,
      });
    } catch (err) {
      // 4. Bắt lỗi runtime
      setError(err.message || 'Đã có lỗi không xác định xảy ra.');
      notifications.show({
        title: 'Lỗi!',
        message: err.message,
        color: 'red',
        icon: <AlertCircle size={18} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setInputText('');
    setInputFile(null);
    setOutputHash('');
    setError('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container size="xl" py="lg">
      {/* Header */}
      <Group mb="lg" gap="xs">
        <Hash size={36} color="#339af0" />
        <Title order={1}>Hash Functions Tool</Title>
      </Group>

      <Paper shadow="md" radius="md" p="xl" withBorder>

        {/* Bước 1: Chọn thuật toán */}
        <Group align="flex-end" mb="xl" gap="md">
          <Select
            label="1. Chọn thuật toán băm"
            data={['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3']}
            value={algorithm}
            onChange={(val) => { setAlgorithm(val); setError(''); setOutputHash(''); }}
            allowDeselect={false}
            style={{ flex: 1 }}
          />
          <Stack gap={4}>
            <Text size="xs" c="dimmed">Độ dài output</Text>
            <Badge color={algoInfo.color} variant="light" size="lg">
              {algoInfo.bits} bits
            </Badge>
          </Stack>
        </Group>

        {/* Cảnh báo bảo mật nếu dùng MD5 / SHA-1 */}
        {algoInfo.warning && (
          <Alert
            icon={<AlertCircle size={18} />}
            color="yellow"
            mb="lg"
            radius="md"
          >
            <Text size="sm">
              <strong>Cảnh báo:</strong> {algoInfo.warning}
            </Text>
          </Alert>
        )}

        {/* Bước 2: Chọn nguồn dữ liệu vào */}
        <Tabs
          value={inputMode}
          onChange={(val) => { setInputMode(val); setError(''); setOutputHash(''); }}
          mb="lg"
        >
          <Tabs.List mb="md">
            <Tabs.Tab value="text" leftSection={<Type size={16} />}>
              Nhập văn bản
            </Tabs.Tab>
            <Tabs.Tab value="file" leftSection={<FileText size={16} />}>
              Từ file
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="text">
            <Textarea
              label="2. Nội dung cần băm (Plaintext):"
              placeholder="Nhập văn bản bạn muốn tính hash..."
              rows={5}
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); setError(''); }}
              error={error && inputMode === 'text' && !inputText.trim() ? error : null}
            />
          </Tabs.Panel>

          <Tabs.Panel value="file">
            <FileInput
              label="2. Chọn file cần băm:"
              placeholder="Nhấn để chọn file (tối đa 10MB)"
              value={inputFile}
              onChange={(file) => { setInputFile(file); setError(''); }}
              accept="*/*"
              error={error && inputMode === 'file' && !inputFile ? error : null}
              clearable
            />
            {inputFile && (
              <Text size="xs" c="dimmed" mt={6}>
                File: <strong>{inputFile.name}</strong> ({(inputFile.size / 1024).toFixed(1)} KB)
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>

        {/* Error chung (không thuộc về input cụ thể) */}
        {error && !(
          (inputMode === 'text' && !inputText.trim()) ||
          (inputMode === 'file' && !inputFile)
        ) && (
          <Alert icon={<AlertCircle size={18} />} color="red" mb="lg" radius="md">
            {error}
          </Alert>
        )}

        {/* Bước 3: Execute */}
        <Group gap="sm">
          <Button
            onClick={handleExecute}
            size="md"
            color="blue"
            loading={isLoading}
            leftSection={<Hash size={18} />}
            style={{ flex: 1 }}
          >
            Tính Hash ({algorithm})
          </Button>
          <Button
            onClick={handleReset}
            size="md"
            variant="default"
          >
            Reset
          </Button>
        </Group>

        {/* Output */}
        {outputHash && (
          <>
            <Divider my="xl" label="Kết quả" labelPosition="center" />
            <Paper shadow="sm" radius="md" p="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                  {algorithm} Hash Output:
                </Text>
                <Badge color={algoInfo.color} variant="light">
                  {outputHash.length * 4} bits / {outputHash.length} hex chars
                </Badge>
              </Group>
              <Textarea
                value={outputHash}
                readOnly
                rows={3}
                variant="filled"
                styles={{ input: { fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: '0.03em' } }}
                rightSection={
                  <CopyButton value={outputHash}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        onClick={copy}
                        variant="filled"
                        color={copied ? 'teal' : 'gray'}
                        mt={60}
                        mr={15}
                        title={copied ? 'Đã sao chép!' : 'Sao chép'}
                      >
                        <Clipboard style={{ width: rem(18), height: rem(18) }} />
                      </ActionIcon>
                    )}
                  </CopyButton>
                }
              />
            </Paper>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Hashing;
