import { useQuery } from "@tanstack/react-query";
import type { RadioChangeEvent } from "antd";
import { Input, Pagination, Radio } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCharactersApi } from "../apis/characters.api";
import CharacterCard from "../components/CharacterCard";
import CharacterModal from "../components/CharacterModal";
import Loading from "../components/Loading";
import TitleColor from "../components/TitleColor";
import useNotification from "../hooks/useNotification";
import {
  getCharacterDTO,
  getColorBySpecies,
} from "../services/characters/character.service";
import { CharacterRES } from "../services/characters/characters.response";
import { PaginationRESP } from "../types/response";
import { ViewType } from "../types/view-type";

const { Search } = Input;

function Homepage() {
  const messageApi = useNotification();
  const [urlSelected, setUrlSelected] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = useMemo(
    () =>
      Number(searchParams.get("page"))
        ? isNaN(Number(searchParams.get("page")))
          ? 1
          : Number(searchParams.get("page"))
        : 1,
    [searchParams.get("page")]
  );
  const searchValue = useMemo(
    () => searchParams.get("search") || "",
    [searchParams.get("search")]
  );

  const {
    data: characters,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["characters", currentPage, searchValue],
    queryFn: () =>
      getCharactersApi({
        page: currentPage,
        search: searchValue,
      }) as unknown as Promise<PaginationRESP<CharacterRES>>,
    select(data) {
      return {
        data: data.results,
        count: data.count,
      };
    },
    refetchOnWindowFocus: false,
  });

  const { data: colorMap } = useQuery({
    queryKey: ["color-map", characters?.data],
    queryFn: () =>
      getColorBySpecies(characters?.data.map(getCharacterDTO) || []),
    enabled: !!characters?.data,
    refetchOnWindowFocus: false,
  });

  const onSelectCharacter = (url: string) => {
    setUrlSelected(url);
  };

  const onChangeViewType = (e: RadioChangeEvent) => {
    setView(e.target.value);
  };

  const onSearch: SearchProps["onSearch"] = (data: string) => {
    setSearchParams((params) => {
      data ? params.set("search", data) : params.delete("search");
      return params;
    });
    onChangePagination(1);
  };

  const onChangePagination = (page: number) => {
    setSearchParams((params) => {
      params.set("page", page.toString());
      return params;
    });
  };

  useEffect(() => {
    if (isError) {
      messageApi!.error({ message: "Something went wrong, please try again" });
    }
  }, [isError]);

  return (
    <>
      <div className="m-4">
        <Radio.Group onChange={onChangeViewType} value={view}>
          <Radio value="grid">Grid</Radio>
          <Radio value="list">List</Radio>
        </Radio.Group>
        <div className="mt-2 w-full">
          <Search
            defaultValue={searchValue}
            placeholder="Search text"
            onSearch={onSearch}
            enterButton
          />
        </div>
        {colorMap && (
          <div className="flex gap-4">
            {Object.keys(colorMap).map((c) =>
              colorMap[c] ? (
                <TitleColor
                  key={c}
                  color={colorMap[c].color}
                  name={colorMap[c].name}
                />
              ) : (
                <></>
              )
            )}
          </div>
        )}
        {isFetching && (
          <div className="h-screen">
            <Loading />
          </div>
        )}
        {!isFetching && characters && (
          <>
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 m-4"
                  : "flex flex-col gap-4 p-4 mt-4"
              }
            >
              {characters.data.map((character) => (
                <CharacterCard
                  colorMap={colorMap}
                  viewType={view}
                  key={character.url}
                  data={character}
                  onSelect={onSelectCharacter}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                onChange={(newPage) => onChangePagination(newPage)}
                total={characters.count}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
        {!isFetching && !characters && <p className="text-center">No data</p>}
      </div>
      <CharacterModal onClose={() => setUrlSelected(null)} url={urlSelected} />
    </>
  );
}

export default Homepage;
