import { HomeworldDTO } from "./homeworld.dto";
import { HomeworldRES } from "./homeworld.response";

export const getHomeworldDTO = ({
  climate,
  diameter,
  name,
  orbital_period,
  rotation_period,
}: HomeworldRES): HomeworldDTO => ({
  climate,
  diameter,
  name,
  orbitalPeriod: orbital_period,
  rotationPeriod: rotation_period,
});
