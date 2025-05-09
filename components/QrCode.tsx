import QRCode from 'react-native-qrcode-svg';

export interface QrCodeProps {
  code: string;
  int: 512;
}

export function QrCode(props: QrCodeProps) {
  return (
    <QRCode
      size={props.int}
      value={`https://localhost:8081/join/${props.code}`}
    />
  );
}
