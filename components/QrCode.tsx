import QRCode from 'react-native-qrcode-svg';

export interface QrCodeProps {
  code: string;
  size: 512;
}

export function QrCode(props: QrCodeProps) {
  return (
    <QRCode
      size={props.size}
      value={`https://localhost:8081/join/${props.code}`}
    />
  );
}
