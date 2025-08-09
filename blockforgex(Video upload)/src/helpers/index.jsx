export const stringToColor = (string) => {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xaa;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

export const getSavedToken = () =>
  localStorage.getItem("application_token", "");
export const setSavedToken = (param) =>
  localStorage.setItem("application_token", param);

export const generateRandomToken = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
};

export const sliderToMonths = (num) => {
  if (num < 12) return `${num} months`;
  return `${num - 11} years`;
};
