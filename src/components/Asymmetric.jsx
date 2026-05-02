import { useState } from "react";

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
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>🔐 Asymmetric Encryption (RSA)</h2>

      {/* BUTTONS */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={generateKeys}>🔑 Generate Key</button>{" "}
        <button onClick={encrypt}>🔒 Encrypt</button>{" "}
        <button onClick={decrypt}>🔓 Decrypt</button>
      </div>

      {/* STATUS */}
      {status && (
        <div style={{ marginBottom: 10, color: "blue" }}>
          {status}
        </div>
      )}

      {/* PLAINTEXT */}
      <div>
        <label>Plaintext:</label>
        <textarea
          style={{ width: "100%", height: 80 }}
          placeholder="Nhập nội dung..."
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
        />
      </div>

      {/* CIPHERTEXT */}
      <div>
        <label>Ciphertext (Base64):</label>
        <textarea
          style={{ width: "100%", height: 80 }}
          placeholder="Kết quả mã hóa..."
          value={cipherText}
          onChange={(e) => setCipherText(e.target.value)}
        />
      </div>
    </div>
  );
}