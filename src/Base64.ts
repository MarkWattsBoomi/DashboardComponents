export class Base64 {
    static decode(src: string): string {
        return Buffer.from(src, 'base64').toString('binary');
    }

    static encode(src: string) {
        return Buffer.from(src).toString('base64');
    }

}
