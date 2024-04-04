"use client";
import { useClient } from "@/api/context";
import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
// @ts-expect-error
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  IconDefinition,
  faMagnifyingGlass,
  faPenFancy,
  faPerson,
  faShareSquare,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import {
  FloatingArrow,
  arrow,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import toast from "react-hot-toast";

const ShareTimes = [
  {
    label: "Una Hora",
    seconds: 3600,
  },
  {
    label: "Un Día",
    seconds: 86400,
  },
  {
    label: "Una Semana",
    seconds: 604800,
  },
  {
    label: "Una Mes",
    seconds: 2592000,
  },
];

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

  const hasSecret = query.has("secret");
  const { client } = useClient(hasSecret ? "public" : "user");

  const { data } = client.reports.useSwr((f) =>
    f.one(params.slug, query.get("secret") ?? undefined),
  )();

  const [openShare, setOpenShare] = useState(false);

  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: openShare,
    onOpenChange: setOpenShare,
    middleware: [
      offset(13),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
    placement: "top",
    strategy: "absolute",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const handleShare = (time: number) => {
    setOpenShare(false);

    const f = async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + time * 1000);

      const { secret } = await client.reports
        .createSecret(params.slug, {
          expiresAt: expiresAt.toISOString(),
        })
        .submit();

      const url = `${window.location.origin}/reports/${params.slug}?secret=${secret}`;

      await window.navigator.clipboard.writeText(url);
      try {
        await window.navigator.share({
          url,
          title: "Ultrasonido",
        });
      } catch (err) {}
    };

    void toast
      .promise(f(), {
        loading: "Generando link de ultrasonido...",
        success: "Link copiado al portapapeles!",
        error: "Error al generar link de ultrasonido",
      })
      .then();
  };

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      {openShare && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="flex flex-col gap-2 bg-white p-3 rounded-lg border border-black/20 shadow-black/30 shadow text-lg z-50"
        >
          <FloatingArrow
            ref={arrowRef}
            context={context}
            fill="white"
            strokeWidth={2}
            stroke="gray"
          />
          <div className="text-xs text-gray-800 text-center">
            Cuanto tiempo quieres
            <br />
            compartir este ultrasonido?
          </div>
          <div className="w-full border-t border-t-black/20" />

          {ShareTimes.map((it) => (
            <button
              type="button"
              className="bg-verde-salud text-white px-4 py-1 pl-5 rounded relative"
              key={it.seconds}
              onClick={() => {
                handleShare(it.seconds);
              }}
            >
              <div className="w-2 h-full bg-blue-400 absolute top-0 left-0 rounded-l" />
              {it.label}
            </button>
          ))}
        </div>
      )}

      <Navbar />
      {/* Main Section */}

      <div className="flex flex-col gap-8">
        <div className="pt-5 px-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mi Ultrasonido </h2>
            {
              !hasSecret && (
                <button
                  className="text-xl"
                  ref={refs.setReference}
                  {...getReferenceProps()}
                >
                  <FontAwesomeIcon icon={faShareSquare} />
                </button>
              )
            }
          </div>
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
          <Splide
            options={{
              rewind: true,
            }}
          >
            {data?.images.map((image) => (
              <SplideSlide key={image}>
                <img
                  alt="Imagen de Ultrasonido"
                  src={client.reports.buildMediaURL(params.slug, image, true)}
                  className="object-cover w-full h-full"
                />
              </SplideSlide>
            ))}

            {data?.videos.map((video) => (
              <SplideSlide key={video}>
                <video
                  controls
                  src={client.reports.buildMediaURL(params.slug, video, true)}
                  className="object-cover w-full h-full"
                >
                  Tu navegador no soporta la etiqueta video
                </video>
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
                      <span className="font-bold">{it.split(" ")[0]}</span>{" "}
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
