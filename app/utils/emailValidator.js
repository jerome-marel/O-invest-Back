const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function validateEmail(email) {
  emailRegex.test(email);
}
