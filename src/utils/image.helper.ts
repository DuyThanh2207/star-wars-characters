export const getRandomImage = () => {
  const randomId = Math.floor(Math.random() * 10) + 1;
  return `https://starwars-visualguide.com/assets/img/characters/${randomId}.jpg`;
};
