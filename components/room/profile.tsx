import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { HexColorPicker } from "react-colorful";
import { Dispatch, SetStateAction, useState } from "react";
import { MessageAuthor } from "@/app/room/[id]/page";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Gamepad2,
  Cpu,
  Ghost,
  Terminal,
  Code2,
  Zap,
  Skull,
  Cat,
  Headphones,
  MonitorPlay,
  LucideIcon,
  User,
  User2,
} from "lucide-react";

const ICONS = [
  Gamepad2,
  Cpu,
  Ghost,
  Terminal,
  Code2,
  Zap,
  Skull,
  Cat,
  Headphones,
  MonitorPlay,
  User,
  User2,
];

export default function Profile({
  author,
  setAuthor,
}: {
  author: MessageAuthor;
  setAuthor: Dispatch<SetStateAction<MessageAuthor>>;
}) {
  const [color, setColor] = useState<string>(author.color);
  const [iconName, setIconName] = useState<string>(author.icon);

  function handleProfileSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get("name") as string;

    setAuthor({
      name,
      color,
      icon: iconName,
    });

    localStorage.setItem(
      "author",
      JSON.stringify({
        name,
        color,
        icon: iconName,
      }),
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-6/12 ">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-y-4">
          <div className="gap-y-1 flex flex-col">
            <span className="font-bold text-center w-full block text-xl">
              Icon
            </span>
            <div className="grid grid-cols-3 gap-2">
              {ICONS.map((name, i) => (
                <Icon
                  key={i}
                  Name={name}
                  color={color}
                  setIconName={setIconName}
                  iconName={iconName}
                />
              ))}
            </div>
          </div>

          <div className="gap-y-1 flex flex-col">
            <span className="font-bold text-center w-full block text-xl">
              Name
            </span>
            <Input name="name" maxLength={20} defaultValue={author.name} />
          </div>

          <div className="flex-col flex gap-y-1 justify-center items-center w-full">
            <span className="font-bold text-center w-full block text-xl">
              Color
            </span>
            <ColorPicker color={color} setColor={setColor} />
          </div>
          <Button>Save</Button>
        </form>
      </div>
    </div>
  );
}

function ColorPicker({
  color,
  setColor,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-37.5 justify-start gap-2">
          {/* Renk önizleme dairesi */}
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: color }}
          />
          <span className="truncate">{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker color={color} onChange={(c) => setColor(c)} />
      </PopoverContent>
    </Popover>
  );
}

function Icon({
  Name,
  color,
  setIconName,
  iconName,
}: {
  Name: LucideIcon;
  color: string;
  setIconName: Dispatch<SetStateAction<string>>;
  iconName: string;
}) {
  return (
    <Avatar
      className="h-8 w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12 mr-1 border"
      onClick={() => setIconName(Name.displayName as string)}
    >
      <AvatarFallback
        style={{ backgroundColor: color }}
        className={` ${Name.displayName == iconName && "border border-white"}  h-full w-full text-white `}
      >
        <Name />
      </AvatarFallback>
    </Avatar>
  );
}
