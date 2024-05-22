export const mockVerify = async (email: string, code: string) => {
  console.log("mockVerify", email, code);
  if (email === "a@b.c" && code === "123") {
    return { status: 200, key: "valid", expiresAt: Date.now() + 120 };
  }
  return { status: 401 };
};
