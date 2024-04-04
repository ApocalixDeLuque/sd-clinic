'use client';
import React, { useState } from 'react';

import ProfileLayout from '@/app/components/ProfileLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useClient } from '@/api/context';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

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

const CrearReporte: React.FC<PatientCardProps> = ({
  date = patientInfo.date,
  patientName = patientInfo.patientName,
  birthDate = patientInfo.birthDate,
  age = patientInfo.age,
  gender = patientInfo.gender,
  branch = patientInfo.branch,
}) => {
  const { client } = useClient();

  const [study, setStudy] = useState('');
  const [tecnic, setTecnic] = useState('');
  const [reason, setReason] = useState('');
  const [observations, setObservations] = useState(['']);

  const handleSave = async () => {
    const f = async () => {
      const r = await client.reports
        .create({
          patientId: '660e027665a681ae8fff3ffa',
          reason,
          tecnic,
          study,
          observations,
        })
        .submit();
      console.log(r);
      return r;
    };

    void toast
      .promise(f(), {
        loading: 'Guardando...',
        success: 'Guardado',
        error: 'Error al guardar',
      })
      .then();
  };

  const handlePrint = () => {
    toast.success('Imprimiendo...');
    setTimeout(() => {
      handleSave();
    }, 3000);
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

        <div className="w-full h-64 font-medium border-2 rounded-md p-2 border-gray-400 placeholder:text-gray-400"></div>
        <Button text="Imprimir" onClick={handlePrint} selected />
        <Button text="Guardar" onClick={handleSave} selected />
      </div>
    </ProfileLayout>
  );
};

export default CrearReporte;
