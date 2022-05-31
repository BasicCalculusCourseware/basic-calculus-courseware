import jwt from 'jsonwebtoken';

export function sign(data: any = {}) {
    const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY as string;
    return jwt.sign({ ...data }, secretKey);
}
export function verify(token: string) {
    const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY as string;
    return jwt.verify(token, secretKey) as any;
}
export function verifyResult(token: string) {
    const { error, body } = verify(token);
    if (error) throw error;
    if (!body) throw 'body is missing';
    return body;
}
