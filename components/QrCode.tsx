import QRCode from 'react-native-qrcode-svg';

export interface QrCodeProps {
  code: string;
  size: number;
}

export function QrCode(props: QrCodeProps) {
  return (
    <QRCode
      size={props.size}
      value={`https://localhost:8081/join/${props.code}`}
    />
  );
}
