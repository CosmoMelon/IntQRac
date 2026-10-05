import fs from 'node:fs/promises';
import QRCode from 'qrcode';

const samples = {
  'john.png': 'ietqr://pay?v=1&type=email&to=john@example.com',
  'coffee-static.png': 'ietqr://pay?v=1&type=email&to=payments@coffee.ca',
  'coffee-prefilled.png': 'ietqr://pay?v=1&type=email&to=payments@coffee.ca&am=18.75&cu=CAD&msg=Order%201284&ref=ORD1284',
  'sarah.png': 'ietqr://pay?v=1&type=email&to=sarah@example.com',
  'unsupported-website.png': 'https://example.com',
};
await fs.mkdir('public/samples', { recursive: true });
for (const [file, payload] of Object.entries(samples)) {
  await QRCode.toFile(`public/samples/${file}`, payload, { width: 960, margin: 4, errorCorrectionLevel: 'H' });
}
