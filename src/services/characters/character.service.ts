import { getDataApi } from "../../apis/common";
import { ColorMap } from "../../types/color-map";
import { generateRandomHexColor } from "../../utils/color.helper";
import { getRandomImage } from "../../utils/image.helper";
import { getSpecieDTO } from "../species/species.service";
import { CharacterDTO } from "./character.dto";
import { CharacterRES } from "./characters.response";

export const getCharacterDTO = ({
  birth_year,
  gender,
  height,
  homeworld,
  mass,
  name,
  species,
  url,
}: CharacterRES): CharacterDTO => ({
  birthYear: birth_year,
  gender,
  height,
  homeworld,
  mass,
  name,
  species: species[0] || "",
  url,
  image: getRandomImage(),
});

export const getColorBySpecies = async (data: CharacterDTO[]) => {
  const colorMap: ColorMap = {};
  const listSpecies = await Promise.all(
    data.filter((d) => d.species).map((d) => getDataApi(d.species))
  );
  const listSpeciesDTO = listSpecies.map((d: any) => getSpecieDTO(d));
  listSpeciesDTO.forEach((d) => {
    if (d.url && !colorMap[d.url]) {
      colorMap[d.url] = {
        color: generateRandomHexColor(),
        name: d.name,
      };
    }
  });
  return colorMap;
};
