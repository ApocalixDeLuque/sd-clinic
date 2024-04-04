export interface DoctorEntity {
  _id: string;
}

export interface Report extends DoctorEntity {
  patientId:
    | string
    | {
        _id: string;
        name: string;
      };
  doctorId:
    | string
    | {
        _id: string;
        name: string;
      };
  reason: string;
  observations: string[];
  tecnic: string;
  study: string;
  images: string[];
  videos: string[];
  published: boolean;
  createdAt: string;
}

export interface FileMetadata extends DoctorEntity {
  name: string;
  size: number;
  contentType: string;
}

export interface Patient extends DoctorEntity {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
}
