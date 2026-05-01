import CryptoJS from 'crypto-js';

export const generateRandomKey = (algorithm = 'AES') => {
  let keySize = 32;
  if (algorithm === 'DES') keySize = 8;
  if (algorithm === '3DES') keySize = 24;

  const key = CryptoJS.lib.WordArray.random(keySize);
  return {
    key: key.toString(CryptoJS.enc.Hex),
    algorithm
  };
};

export const symmetricProcess = (action, algorithm, mode, text, keyHex) => {
  try {
    const key = CryptoJS.enc.Hex.parse(keyHex);

    let output = "";

    const algo = algorithm === 'AES' ? 'AES' : algorithm === '3DES' ? 'TripleDES' : 'DES';

    if (action === 'encrypt') {
      output = CryptoJS[algo].encrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
    } else {
      const decrypted = CryptoJS[algo].decrypt(text, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      output = decrypted.toString(CryptoJS.enc.Utf8);

      if (!output) {
        throw new Error("Giải mã thất bại: Sai khóa hoặc dữ liệu không hợp lệ");
      }
    }

    return {
      success: true,
      result: output,
      algorithm: `${algorithm}-ECB`
    };

  } catch (error) {
    console.error("Crypto Error:", error);
    return {
      success: false,
      error: error.message || "Lỗi mã hóa/giải mã. Vui lòng kiểm tra khóa."
    };
  }
};