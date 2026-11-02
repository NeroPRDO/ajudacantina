// Tiny dependency-free raster renderer for our original bowl icon. No photo processing.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
const crc32 = buffer => { let crc=0xffffffff; for(const byte of buffer){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0; };
function chunk(type,data) { const name=Buffer.from(type); const size=Buffer.alloc(4);size.writeUInt32BE(data.length);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([name,data])));return Buffer.concat([size,name,data,crc]); }
export function createIcons(directory) {
  for(const size of [192,512]) {
    const rows=Buffer.alloc((size*3+1)*size);
    for(let y=0;y<size;y++)for(let x=0;x<size;x++) {
      const sx=x/size*192,sy=y/size*192;
      const bowl=sy>=87 && (sx-96)**2+(sy-87)**2<=53**2;
      const foot=sy>=145 && sy<=153 && sx>=72 && sx<=120;
      const steam=[73,98,123].some((center,i)=>{const top=i===1?36:42;return sy>=top&&sy<=top+29&&Math.abs(sx-(center+4*Math.sin((sy-top)/29*Math.PI*2)))<4;});
      const rgb=bowl||foot||steam?[33,22,47]:[180,154,255]; const pos=y*(size*3+1)+1+x*3;
      rgb.forEach((value,i)=>{rows[pos+i]=value;});
    }
    const header=Buffer.alloc(13);header.writeUInt32BE(size,0);header.writeUInt32BE(size,4);header[8]=8;header[9]=2;
    writeFileSync(`${directory}/icon-${size}.png`,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]));
  }
}
