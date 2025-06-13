import { IdentifyPacket } from '@/common/networking/packet/Packet';
import { PacketCodex } from '@/common/networking/packet/PacketTransformer';

const identifyCodex = new PacketCodex<'identify', IdentifyPacket>('identify', {
  id: 0,
  token: 0,
});

describe('PacketTransformer', () => {
  it('should decode and encode a packet', () => {
    const data: IdentifyPacket = {
      id: 'hi',
      index: 23,
      type: 'identify',
      token: '2pifdjf',
    };
    const encoded = identifyCodex.encode(data);
    expect(encoded).toEqual([23, 0, 'hi', '2pifdjf']);
    const decoded = identifyCodex.decode(encoded);
    expect(decoded).toEqual(data);
  });
});
