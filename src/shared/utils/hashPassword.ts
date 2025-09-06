import { genSalt, hash } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(12);
  return hash(password, salt);
};
