import bcrypt from 'bcryptjs';

export default async function encrpyt(password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}
