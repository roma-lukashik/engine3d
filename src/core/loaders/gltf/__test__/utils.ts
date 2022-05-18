export const base64ToBuffer = (base64: string): ArrayBuffer => new Uint8Array(Buffer.from(base64, 'base64')).buffer
