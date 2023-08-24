const nameRegex = /^[A-Za-z\-']{1,}$/;

export default function validateName(name) {
  return nameRegex.test(name);
}
