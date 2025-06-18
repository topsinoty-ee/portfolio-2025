/** @format */
import jwksClient from 'jwks-rsa';
import secret from '@/config';
import jwt from 'jsonwebtoken';

export const verifyToken = async (token: string): Promise<jwt.JwtPayload> => {
  if (!secret.auth0Domain) throw new Error('Auth0 domain not set');
  
  const client = jwksClient({
    jwksUri: `https://${secret.auth0Domain}/.well-known/jwks.json`,
  });
  
  const getKey: jwt.GetPublicKeyOrSecret = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
    if (!header.kid) return callback(new Error('No kid found in token header'));
    
    
    client.getSigningKey(header.kid, (err: Error | null, key: jwksClient.SigningKey) => {
      if (err) return callback(err);
      
      const signingKey = key;
      const publicKey = "publicKey" in signingKey ? signingKey.publicKey : signingKey.rsaPublicKey;
      
      if (!publicKey) return callback(new Error('No public key found'));
      
      
      callback(null, publicKey);
    });
  };
  
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      algorithms: ['RS256'], issuer: `https://${secret.auth0Domain}/`, audience: secret.auth0Audience
    }, (err, decoded) => {
      if (err) return reject(err);
      if (!decoded) return reject(new Error('Token could not be decoded'));
      resolve(decoded instanceof Object ? decoded : null);
    });
  });
};