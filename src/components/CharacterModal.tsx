import { useQuery } from "@tanstack/react-query";
import { Image, Modal } from "antd";
import { useEffect, useMemo } from "react";
import { getDataApi } from "../apis/common";
import useNotification from "../hooks/useNotification";
import { getCharacterDTO } from "../services/characters/character.service";
import { CharacterRES } from "../services/characters/characters.response";
import { HomeworldRES } from "../services/homeworld/homeworld.response";
import { getHomeworldDTO } from "../services/homeworld/homeworld.service";
import Loading from "./Loading";

type Props = {
  url: string | null;
  onClose: () => void;
};

function CharacterModal({ url, onClose }: Props) {
  const isShow = useMemo(() => !!url, [url]);
  const messageApi = useNotification();
  const {
    data: character,
    isFetching,
    isError: isErrorCharacter,
  } = useQuery({
    queryKey: ["character"],
    queryFn: () => getDataApi(url!) as unknown as Promise<CharacterRES>,
    select(data: CharacterRES) {
      return getCharacterDTO(data);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!url,
  });

  const {
    data: homeworld,
    isFetching: isFetchingHomeworld,
    isError: isErrorHomeworld,
  } = useQuery({
    queryKey: ["homeworld", character?.homeworld],
    queryFn: () =>
      getDataApi(character!.homeworld) as unknown as Promise<HomeworldRES>,
    select(data: HomeworldRES) {
      return getHomeworldDTO(data);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: !!character?.homeworld,
  });
  const isError = useMemo(
    () => isErrorCharacter || isErrorHomeworld,
    [isErrorCharacter, isErrorHomeworld]
  );

  useEffect(() => {
    if (isError) {
      messageApi!.error({ message: "Something went wrong, please try again" });
    }
  }, [isError]);

  return (
    <Modal
      destroyOnClose
      title={
        !isFetching && !isFetchingHomeworld && character ? character.name : ""
      }
      footer={null}
      open={isShow}
      onCancel={onClose}
    >
      {(isFetching || isFetchingHomeworld) && (
        <div className="p-4">
          <Loading />
        </div>
      )}
      {!isFetching && !isFetchingHomeworld && character && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="w-full">
              <Image
                className="w-full h-auto aspect-square object-cover rounded-lg"
                src={character.image}
                alt={character.name}
              />
            </div>
            <div>
              <div className="flex flex-col gap-4">
                <span>
                  <strong>Height:</strong> {character.height} cm
                </span>
                <span>
                  <strong>Mass:</strong> {character.mass} kg
                </span>
                <span>
                  <strong>Birth Year:</strong> {character.birthYear}
                </span>
                <span>
                  <strong>Gender:</strong> {character.gender}
                </span>
              </div>
              {homeworld && (
                <div className="flex flex-col gap-4">
                  <h3 className="mb-0">Homeworld</h3>
                  <span>
                    <strong>Name:</strong> {homeworld.name}
                  </span>
                  <span>
                    <strong>Rotation Period:</strong> {homeworld.rotationPeriod}
                  </span>
                  <span>
                    <strong>Orbital Period:</strong> {homeworld.orbitalPeriod}
                  </span>
                  <span>
                    <strong>Diameter:</strong> {homeworld.diameter}
                  </span>
                  <span>
                    <strong>Climate:</strong> {homeworld.climate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isFetching && !isFetchingHomeworld && !character && !homeworld && (
        <p className="text-center">No data</p>
      )}
    </Modal>
  );
}

export default CharacterModal;
