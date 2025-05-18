import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

type BarcodeType = "QR" | "EAN";

export async function generateBarcode(
  type: BarcodeType = "EAN"
): Promise<string> {
  if (type === "QR") {
    // For QR codes, we'll generate a UUID and encode it as QR
    const uuid = uuidv4();
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(uuid);
      // Return just the data part (remove the data URL prefix)
      return qrCodeDataUrl.split(",")[1];
    } catch (error) {
      throw new Error("Failed to generate QR code");
    }
  } else {
    // For EAN-13 (simplified implementation)
    // In a real application, you would implement proper EAN-13 with checksum
    const randomPart = Math.floor(
      100000000000 + Math.random() * 900000000000
    ).toString();

    // Calculate EAN-13 checksum digit
    const digits = randomPart.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }

    const checksum = (10 - (sum % 10)) % 10;
    return randomPart + checksum.toString();
  }
}

// For bulk generation
export async function generateBarcodes(
  count: number,
  type: BarcodeType = "EAN"
): Promise<string[]> {
  const barcodes: string[] = [];
  for (let i = 0; i < count; i++) {
    barcodes.push(await generateBarcode(type));
  }
  return barcodes;
}
