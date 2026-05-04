import { useState } from "react";
import { Container, Title, Group, Button, Textarea, Text, Paper } from '@mantine/core';

export default function Asymmetric() {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [status, setStatus] = useState("");

  // 🔑 Generate Key Pair
  const generateKeys = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);
      setStatus("✅ Đã tạo key thành công");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi tạo key");
    }
  };

  // 🔒 Encrypt
  const encrypt = async () => {
    if (!publicKey) {
      setStatus("⚠️ Bạn chưa tạo Public Key");
      return;
    }

    if (!plainText) {
      setStatus("⚠️ Bạn chưa nhập nội dung");
      return;
    }

    try {
      const encoded = new TextEncoder().encode(plainText);

      const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encoded
      );

      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(encrypted))
      );

      setCipherText(base64);
      setStatus("🔒 Mã hóa thành công");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi mã hóa (text quá dài hoặc key lỗi)");
    }
  };

  // 🔓 Decrypt
  const decrypt = async () => {
    if (!privateKey) {
      setStatus("⚠️ Bạn chưa có Private Key");
      return;
    }

    if (!cipherText) {
      setStatus("⚠️ Chưa có ciphertext");
      return;
    }

    try {
      const data = Uint8Array.from(atob(cipherText), (c) =>
        c.charCodeAt(0)
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        data
      );

      const text = new TextDecoder().decode(decrypted);
      setPlainText(text);
      setStatus("🔓 Giải mã thành công");
    } catch (err) {
      console.error(err);
      setStatus("❌ Giải mã thất bại (sai key hoặc dữ liệu)");
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper withBorder p="xl" radius="md" shadow="sm">
        <Title order={2} mb="lg" c="blue.7">
          🔐 Asymmetric Encryption (RSA)
        </Title>

        {/* BUTTONS */}
        <Group mb="md">
          <Button color="teal" onClick={generateKeys} variant="light">
            🔑 Generate Key
          </Button>
          <Button color="blue" onClick={encrypt} variant="filled">
            🔒 Encrypt
          </Button>
          <Button color="grape" onClick={decrypt} variant="filled">
            🔓 Decrypt
          </Button>
        </Group>

        {/* STATUS */}
        {status && (
          <Text 
            fw={500} 
            mb="md" 
            c={status.includes("❌") || status.includes("⚠️") ? "red" : "teal"}
          >
            {status}
          </Text>
        )}

        {/* PLAINTEXT */}
        <Textarea
          label="Plaintext:"
          placeholder="Nhập nội dung..."
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          minRows={4}
          mb="md"
          autosize
        />

        {/* CIPHERTEXT */}
        <Textarea
          label="Ciphertext (Base64):"
          placeholder="Kết quả mã hóa..."
          value={cipherText}
          onChange={(e) => setCipherText(e.target.value)}
          minRows={4}
          autosize
        />
      </Paper>
    </Container>
  );
}