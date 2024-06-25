export function generateRandomHexColor() {
  let hexCode = "#";
  const color = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
  for (let i = 0; i < 3; i++) {
    hexCode += color();
  }
  return hexCode;
}
