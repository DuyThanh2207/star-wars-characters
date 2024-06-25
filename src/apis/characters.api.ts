import { CharactersParams } from "../services/characters/character.request";
import { api } from "./api";

export const getCharactersApi = (params: CharactersParams) =>
  api.get("https://swapi.dev/api/people", { params });
