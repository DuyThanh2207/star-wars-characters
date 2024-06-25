type Props = {
  name: string;
  color: string;
};

function TitleColor({ color, name }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: color }}
      ></div>
      <p>{name}</p>
    </div>
  );
}

export default TitleColor;
