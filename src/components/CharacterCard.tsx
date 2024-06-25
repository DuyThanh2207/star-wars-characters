import { Card } from "antd";
import { useMemo } from "react";
import { getCharacterDTO } from "../services/characters/character.service";
import { CharacterRES } from "../services/characters/characters.response";
import { ColorMap } from "../types/color-map";
import { ViewType } from "../types/view-type";

const { Meta } = Card;

type Props = {
  colorMap?: ColorMap;
  viewType: ViewType;
  data: CharacterRES;
  onSelect: (url: string) => void;
};

function CharacterCard({ colorMap, viewType, data, onSelect }: Props) {
  const character = useMemo(() => getCharacterDTO(data), [data]);
  return viewType === "grid" ? (
    <Card
      hoverable
      className="w-full"
      style={
        colorMap && colorMap[character.species]
          ? { border: `2px solid ${colorMap[character.species].color}` }
          : {}
      }
      cover={
        <img
          className="aspect-square object-cover"
          alt={character.name}
          src={character.image}
        />
      }
      onClick={() => onSelect(character.url)}
    >
      <Meta title={character.name} />
    </Card>
  ) : (
    <div
      className="grid grid-cols-12 gap-4"
      style={
        colorMap && colorMap[character.species]
          ? { border: `2px solid ${colorMap[character.species].color}` }
          : {}
      }
    >
      <div className="col-span-1">
        <div className="w-full">
          <img
            className="w-full h-auto aspect-square object-cover"
            alt={character.name}
            src={character.image}
          />
        </div>
      </div>
      <div className="col-span-11">
        <span>{character.name}</span>
      </div>
    </div>
  );
}

export default CharacterCard;
