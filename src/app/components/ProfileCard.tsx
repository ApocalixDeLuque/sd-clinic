import React from "react";
import SectionsMenu from "./SectionsMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/api/session";

const ProfileCard = () => {
  const session = useSession();

  return (
    <div className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
      <div className="flex gap-2">
        <img src="/images/pfp.png" alt="logo" />
        <div className="flex flex-col gap-2">
          <p className="font-bold">{session.user?.name ?? "Sin Nombre"}</p>
          <div>
            <p className="font-bold">Último ingreso:</p>
            <p>
              {new Date(
                (session.token?.claims.iat ?? 1) * 1000,
              ).toLocaleDateString("es-MX", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hourCycle: "h24",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faGear}
          className="aspect-square w-8 self-start"
        />
      </div>
      <SectionsMenu />
    </div>
  );
};

export default ProfileCard;
