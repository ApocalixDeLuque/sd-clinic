"use client";
import React, { ChangeEvent, useRef, useState } from "react";

import ProfileLayout from "@/app/components/ProfileLayout";
import Input from "../components/Input";
import Button from "../components/Button";
import { useClient } from "@/api/context";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faImage,
  faMinus,
  faPlus,
  faTimesCircle,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import cn from "classnames";
import Link from "next/link";

interface PatientCardProps {
  date: string;
  patientName: string;
  birthDate: string;
  age: number;
  gender: string;
  branch: string;
}

function getAge(birthday: Date): number {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function FileInput({
  value,
  onFileChange: setValue,
  disableClick,
  onDelete,
}: {
  value?: File | null;
  onFileChange?: (file: File) => void;
  onDelete?: () => void;
  disableClick?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // URL.createObjectURL(file);
      setValue?.(file);
    }
  };

  const handleOnClick = () => {
    if (disableClick) return;

    if (ref.current) {
      ref.current.click();
    }
  };

  return (
    <div
      className={cn(
        "w-full relative border min-h-[200px] hover:border-gray-400 transition lg:w-[300px] rounded-xl",
        {
          "border-dashed": !value,
          "border-verde-salud bg-verde-salud/10": !!value,
        },
      )}
    >
      {value && (
        <button
          className="absolute text-white right-0 p-2 text-2xl mix-blend-difference z-50"
          onClick={() => {
            onDelete?.();
          }}
        >
          <FontAwesomeIcon icon={faTimesCircle} />
        </button>
      )}

      <input
        // accept images, videos and dcm files
        accept="image/*, video/*, .dcm"
        type="file"
        className="hidden"
        ref={ref}
        onChange={handleOnChange}
      />
      <button
        className="text-gray-300 hover:text-gray-400 flex flex-col justify-center items-center gap-2 rounded-2xl w-full h-full"
        onClick={handleOnClick}
      >
        {value ? (
          <div className="flex justify-center items-center w-full h-full">
            {value.type.startsWith("image") && (
              <img
                src={URL.createObjectURL(value as unknown as File)}
                className="object-cover w-full h-full rounded-xl"
              />
            )}
            {value.type.startsWith("video") && (
              <video
                src={URL.createObjectURL(value as unknown as File)}
                className="object-cover w-full h-full rounded-xl"
                autoPlay
                muted
                loop
              />
            )}
            {value.type === "application/dicom" && (
              <div className="flex flex-col gap-1 text-verde-salud">
                <FontAwesomeIcon icon={faUserDoctor} className="text-5xl" />
                {value.name}
              </div>
            )}
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faImage} className="text-5xl p-10" />
            <div className="text-sm">Agregar un archivo</div>
          </>
        )}
      </button>
    </div>
  );
}

export default function CrearReporte() {
  const { client } = useClient();

  const { data: patients } = client.patients.useSwr((f) => f.all())();

  const [study, setStudy] = useState("");
  const [tecnic, setTecnic] = useState("");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState([""]);
  const [patientId, setPatientId] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string>();

  const { data: pPatient } = client.patients.useSwr(
    (f) => f.one(patientId || ""),
    Boolean(patientId),
  )();

  const handlePublish = async () => {
    const f = async () => {
      if (!savedId) throw new Error("No se ha guardado el reporte");

      client.reports.publish(savedId).submit();
    };

    toast.promise(f(), {
      loading: "Publicando...",
      success: "Publicado",
      error: (e) => e.message,
    });
  };

  const handleSave = async () => {
    const f = async () => {
      const howManyImagesAre = files.filter((file) =>
        file.type.startsWith("image"),
      ).length;

      if (howManyImagesAre < 4)
        throw new Error("Se necesitan al menos 4 imágenes");

      const savedFiles = await Promise.all(
        files.map(async (file) => {
          return await client.files.upload(file).submit();
        }),
      );

      const r = await client.reports
        .create({
          patientId,
          reason,
          tecnic,
          study,
          observations,
        })
        .submit();

      setSavedId(r._id);

      await client.reports
        .attachMedia(r._id, {
          content: savedFiles.map((file) => ({
            type: file.contentType.startsWith("image")
              ? "image"
              : file.contentType.startsWith("video")
                ? "video"
                : "dicom",
            id: file._id,
          })),
        })
        .submit();

      return r;
    };

    void toast
      .promise(f(), {
        loading: "Guardando...",
        success: "Guardado",
        error: (e) => e.message,
      })
      .then(() => {
        setSaved(true);
      });
  };

  const addObservation = () => {
    setObservations([...observations, ""]);
  };

  const removeObservation = (index: number) => {
    setObservations(observations.filter((_, i) => i !== index));
  };

  const handleObservationChange = (index: number, value: string) => {
    const newObservations = [...observations];
    newObservations[index] = value;
    setObservations(newObservations);
  };

  return (
    <ProfileLayout title="Expediente">
      <Link
        href={"/medico"}
        className="flex items-center self-start gap-2 text-verde-salud font-bold lg:text-xl"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <p>Regresa a la lista de pacientes</p>
      </Link>
      <div className="flex flex-col-reverse lg:flex-row w-full items-center justify-between lg:px-12 text-lg">
        <div className="flex flex-col w-full gap-2 lg:gap-0">
          <div className="flex flex-col lg:flex-row lg:gap-2">
            <div className="font-bold">Paciente:</div>
            <div className="text-gray-600">{pPatient?.name}</div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-2">
            <div className="font-bold">Fecha de nacimiento:</div>
            <div className="text-gray-600">
              {pPatient && (
                <>
                  {new Date(pPatient?.birthday).toLocaleString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    timeZone: "UTC",
                  })}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-2">
            <div className="font-bold">Edad:</div>
            <div className="text-gray-600">
              {pPatient && <>{getAge(new Date(pPatient.birthday))} años</>}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:gap-2">
            <div className="font-bold">Sexo:</div>
            <div className="text-gray-600">{pPatient?.gender}</div>
          </div>
        </div>
        <img
          src="/images/women.png"
          className=" aspect-square w-40 h-40 lg:w-[200px] lg:h-[200px]"
          alt="logo"
        />
      </div>
      <div className="flex flex-col w-full px-12 gap-2 lg:text-xl">
        <select
          className={`w-full font-medium border-2 rounded-md p-2 lg:p-4 border-gray-400`}
          onChange={(e) => setPatientId(e.target.value)}
          value={patientId}
          disabled={saved}
        >
          <option disabled value="" selected={patientId === undefined}>
            Selecciona un paciente
          </option>

          {patients?.map((patient) => (
            <option
              key={patient._id}
              value={patient._id}
              selected={patientId === patient._id}
            >
              {patient.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Tecnica"
          onInputChange={setTecnic}
          disabled={saved}
        />
        <Input
          placeholder="Motivo del estudio"
          onInputChange={setReason}
          disabled={saved}
        />
        <Input
          placeholder="Estudio"
          onInputChange={setStudy}
          disabled={saved}
        />
        <div className="flex flex-col w-full items-center gap-1">
          {observations.map((observation, index) => (
            <div key={index} className="flex w-full items-center gap-1">
              <input
                value={observation}
                onChange={(e) => handleObservationChange(index, e.target.value)}
                placeholder={"Observaciones"}
                className={`w-full font-medium border-2 rounded-md lg:p-4 p-2 border-gray-400 placeholder:text-gray-400 lg:text-xl`}
              />
              {index === observations.length - 1 ? (
                <button onClick={addObservation} className="flex self-center">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="aspect-square border-2 rounded-md p-3 lg:p-5 border-gray-400 placeholder:text-gray-400"
                  />
                </button>
              ) : (
                <button
                  onClick={() => removeObservation(index)}
                  className="flex self-center"
                >
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="aspect-square border-2 rounded-md p-3 border-gray-400 placeholder:text-gray-400"
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col w-full font-medium rounded-md lg:p-2 border-gray-400 placeholder:text-gray-400 lg:grid lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <FileInput
              value={file}
              key={file.name}
              disableClick
              onDelete={() => {
                setFiles((prev) => {
                  // delete by index
                  return prev.slice(0, index).concat(prev.slice(index + 1));
                });
              }}
            />
          ))}
          <FileInput
            onFileChange={(file) => {
              setFiles([...files, file]);
            }}
          />
        </div>

        {!saved ? (
          <Button text="Guardar" onClick={handleSave} selected />
        ) : (
          <Button text="Publicar" onClick={handlePublish} selected />
        )}
      </div>
    </ProfileLayout>
  );
}
