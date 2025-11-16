export const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;

  return {
    value1: num1,
    value2: num2,
  };
};
