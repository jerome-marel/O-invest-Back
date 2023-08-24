const nameRegex = /^[A-Za-z]+$/;

export default function validateName(name) {
  return nameRegex.test(name);
}
