import { SpeciesDTO } from "./species.dto";
import { SpeciesRES } from "./species.response";

export const getSpecieDTO = ({
  name,
  skin_colors,
  url,
}: SpeciesRES): SpeciesDTO => ({
  name,
  skinColors: skin_colors,
  url,
});
