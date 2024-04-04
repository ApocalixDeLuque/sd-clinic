'use client';
import React, { ChangeEvent, useRef, useState } from 'react';

import ProfileLayout from '@/app/components/ProfileLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useClient } from '@/api/context';
import toast from 'react-hot-toast';
import { useSession } from '@/api/session';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMinus, faPlus, faTimesCircle, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import cn from 'classnames';

interface PatientCardProps {
  date: string;
  patientName: string;
  birthDate: string;
  age: number;
  gender: string;
  branch: string;
}

const patientInfo = {
  date: 'Martes, 02 de abril de 2024',
  patientName: 'Maria Fernanda Ramirez Gonzalez',
  birthDate: 'Lunes, 01 de abril de 2024',
  age: 24,
  gender: 'Femenino',
  branch: 'Guadalajara Centro',
};

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
      className={cn('relative border min-h-[200px] hover:border-gray-400 transition w-[300px] rounded-xl', {
        'border-dashed': !value,
        'border-verde-salud bg-verde-salud/10': !!value,
      })}
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
            {value.type.startsWith('image') && (
              <img
                src={URL.createObjectURL(value as unknown as File)}
                className="object-cover w-full h-full rounded-xl"
              />
            )}
            {value.type.startsWith('video') && (
              <video
                src={URL.createObjectURL(value as unknown as File)}
                className="object-cover w-full h-full rounded-xl"
                autoPlay
                muted
                loop
              />
            )}
            {value.type === 'application/dicom' && (
              <div className="flex flex-col gap-1 text-verde-salud">
                <FontAwesomeIcon icon={faUserDoctor} className="text-5xl" />
                {value.name}
              </div>
            )}
          </div>
        ) : (
          <>
            <FontAwesomeIcon icon={faImage} className="text-5xl" />
            <div className="text-sm">Agregar un archivo</div>
          </>
        )}
      </button>
    </div>
  );
}

const CrearReporte: React.FC<PatientCardProps> = ({
  date = patientInfo.date,
  patientName = patientInfo.patientName,
  birthDate = patientInfo.birthDate,
  age = patientInfo.age,
  gender = patientInfo.gender,
  branch = patientInfo.branch,
}) => {
  const { client } = useClient();

  const [medicName, setMedicName] = useState();
  const [study, setStudy] = useState('');
  const [tecnic, setTecnic] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState(['']);
  const [files, setFiles] = useState<File[]>([]);

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const f = async () => {
      const savedFiles = await Promise.all(
        files.map(async (file) => {
          return await client.files.upload(file).submit();
        })
      );

      const r = await client.reports
        .create({
          patientId: '660e027665a681ae8fff3ffa',
          reason,
          tecnic,
          study,
          observations,
        })
        .submit();

      await client.reports
        .attachMedia(r._id, {
          content: savedFiles.map((file) => ({
            type: file.contentType.startsWith('image')
              ? 'image'
              : file.contentType.startsWith('video')
              ? 'video'
              : 'dicom',
            id: file._id,
          })),
        })
        .submit();

      return r;
    };

    void toast
      .promise(f(), {
        loading: 'Guardando...',
        success: 'Guardado',
        error: 'Error al guardar',
      })
      .then(() => {
        setSaved(true);
      });
  };

  const addObservation = () => {
    setObservations([...observations, '']);
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
      <div className="flex w-full items-center justify-between px-12 text-lg">
        <div>
          <div className="flex gap-2">
            <div className="font-bold">Fecha:</div>
            <div className="text-gray-600">{date}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">Paciente:</div>
            <div className="text-gray-600">{patientName}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">Fecha de nacimiento:</div>
            <div className="text-gray-600">{birthDate}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">Edad:</div>
            <div className="text-gray-600">{age} años</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">Sexo:</div>
            <div className="text-gray-600">{gender}</div>
          </div>
          <div className="flex gap-2">
            <div className="font-bold">Sucursal:</div>
            <div className="text-gray-600">{branch}</div>
          </div>
        </div>
        <img src="/images/women.png" className=" aspect-square w-[200px] h-[200px]" alt="logo" />
      </div>
      <div className="flex flex-col w-full px-12 gap-2">
        <Input placeholder="Tecnica" onInputChange={setTecnic} />
        <Input placeholder="Motivo del estudio" onInputChange={setReason} />
        <Input placeholder="Estudio" onInputChange={setStudy} />
        <div className="flex flex-col w-full items-center gap-1">
          {observations.map((observation, index) => (
            <div key={index} className="flex w-full items-center gap-1">
              <input
                value={observation}
                onChange={(e) => handleObservationChange(index, e.target.value)}
                placeholder={'Observaciones'}
                className={`w-full font-medium border-2 rounded-md p-2 border-gray-400 placeholder:text-gray-400`}
              />
              {index === observations.length - 1 ? (
                <button onClick={addObservation} className="flex self-center">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="aspect-square border-2 rounded-md p-3 border-gray-400 placeholder:text-gray-400"
                  />
                </button>
              ) : (
                <button onClick={() => removeObservation(index)} className="flex self-center">
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="aspect-square border-2 rounded-md p-3 border-gray-400 placeholder:text-gray-400"
                  />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="w-full font-medium rounded-md p-2 border-gray-400 placeholder:text-gray-400 grid grid-cols-3 gap-5">
          {files.map((file) => (
            <FileInput
              value={file}
              key={file.name}
              disableClick
              onDelete={() => {
                setFiles((prev) => {
                  return prev.filter((f) => f !== file);
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

        {saved ? <Button text="Guardar" onClick={handleSave} selected /> : <Button text="Publicar" selected />}
      </div>
    </ProfileLayout>
  );
};

export default CrearReporte;
