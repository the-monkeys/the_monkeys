export const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 90) + 10;
  const num2 = Math.floor(Math.random() * 10) + 1;

  return {
    value1: num1,
    value2: num2,
  };
};
