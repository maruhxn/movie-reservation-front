import { AvatarProps } from "@radix-ui/react-avatar";

import { Icons } from "@/components/Icons";
import { IUser } from "@/types/user";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/Avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<IUser, "image" | "name">;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
