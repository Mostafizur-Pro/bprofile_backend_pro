import bcrypt from "bcryptjs";

const comparePassword = async (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const hashedPassword = {
  comparePassword,
};
