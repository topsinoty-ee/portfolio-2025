/** @format */

import {createHash} from 'node:crypto';

export function generateAvatarFromEmail(email: string): string {
  const md5 = createHash('md5')
    .update(email.trim().toLowerCase())
    .digest('hex');
  const [username] = email.split('@');
  const displayName = username
    .split('.')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('+');
  
  const fallback = `https://ui-avatars.com/api/${displayName}/128`;
  return `https://www.gravatar.com/avatar/${md5}?d=${encodeURIComponent(
    fallback
  )}`;
}
