"use client";
import { useClient } from "@/api/context";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { type } from "os";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  IconDefinition,
  faMagnifyingGlass,
  faPenFancy,
  faPerson,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";

function extractValueFromComposed(
  u:
    | string
    | {
        _id: string;
        name: string;
      }
    | undefined,
): string {
  if (!u) {
    return "Cargando...";
  }

  if (typeof u === "string") {
    return u;
  }

  return u.name;
}

function DetailsSquare({
  icon,
  name,
  title,
}: {
  icon: IconDefinition;
  name?: string | React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-bold text-lg self-baseline">
        <div className="rounded-xl border border-gray-400 w-16 h-16 flex justify-center items-center">
          <FontAwesomeIcon icon={icon} className="text-3xl" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-xl">{title}</div>
        <div>{name}</div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: { slug: string } }) {
  const query = useSearchParams();

  const { client } = useClient(query.has("secret") ? "public" : "user");

  const { data } = client.reports.useSwr((f) =>
    f.one(params.slug, query.get("secret") ?? undefined),
  )();

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      {/* Navbar */}
      <Navbar />
      {/* Main Section */}

      <div className="flex flex-col gap-8">
        <div className="pt-5 pl-5">
          <h2 className="text-2xl font-bold">Mi Ultrasonido </h2>
          <div>
            {data
              ? new Date(data?.createdAt).toLocaleString("es-MX", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined}
          </div>
        </div>

        <div className="px-5">
          <Splide aria-label="My Favorite Images">
            {data?.images.map((image) => (
              <SplideSlide key={image}>
                <img
                  alt="Imagen de Ultrasonido"
                  src={client.reports.buildMediaURL(params.slug, image, true)}
                  className="object-cover w-full h-full"
                />
              </SplideSlide>
            ))}
          </Splide>
        </div>

        <div>
          <h2 className="text-2xl font-bold pl-5">Resumen</h2>
        </div>
        <div className="px-5 flex flex-col gap-2">
          <DetailsSquare
            icon={faPerson}
            title="Paciente"
            name={extractValueFromComposed(data?.patientId)}
          />

          <DetailsSquare
            icon={faUserDoctor}
            title="Doctor"
            name={`${extractValueFromComposed(data?.doctorId)}`}
          />

          <DetailsSquare
            icon={faPenFancy}
            title="Nombre del Estudio"
            name={data?.study}
          />

          <DetailsSquare
            icon={faPenFancy}
            title="Técnica"
            name={data?.tecnic}
          />

          <DetailsSquare
            icon={faPenFancy}
            title="Motivo del estudio"
            name={data?.reason}
          />

          <DetailsSquare
            icon={faMagnifyingGlass}
            title="Observaciones"
            name={
              <div className="flex felx-col gap-1">
                <ul className="list-disc pl-5">
                  {data?.observations.map((it) => (
                    <li key={it}>
                      <span className="font-bold">
                        {it.split(" ")[0]}
                      </span>{" "}
                      {it.split(" ").slice(1).join(" ")}
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </div>
      </div>

      <div className="flex flex-col w-full p-4 gap-4"></div>
    </main>
  );
}
