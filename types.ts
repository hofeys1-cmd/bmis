export type Role =
  | 'admin'
  | 'occupationalMedicine'
  | 'treatment'
  | 'safety'
  | 'fireDepartment'
  | 'environment';

export interface User {
  id: string;
  username: string;
  password?: string;
  roles: Role[];
}

export interface HealthTip {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  personnelId: string;
  hireDate: string;
  position: string;
}

export interface MedicalRecord {
  id: string;
  personnelId: string;
  examDate: string;
  nextExamDate: string;
  vitals: {
    bmi: string;
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
  };
  bloodTest: {
    wbc: string; rbc: string; hb: string; hct: string; mcv: string; mch: string; mchc: string; rdw: string; plt: string; mpv: string; pdw: string; fbs: string; cho: string; tg: string; ast_ot: string; alt_pt: string; cr: string;
  };
  urinalysis: {
    ph: string; sg: string; color: string; appearance: string; glucose: string; protein: string; ketones: string; blood: string; leukocytes: string; nitrite: string;
  };
  visionTest: {
    rightEyeAcuityUncorrected: string;
    rightEyeAcuityCorrected: string;
    leftEyeAcuityUncorrected: string;
    leftEyeAcuityCorrected: string;
    rightEyeColorVision: 'normal' | 'abnormal';
    leftEyeColorVision: 'normal' | 'abnormal';
    rightEyeVisualField: 'normal' | 'abnormal';
    leftEyeVisualField: 'normal' | 'abnormal';
  };
  audiometry: {
    rightEar500: string;
    rightEar1000: string;
    rightEar2000: string;
    rightEar4000: string;
    leftEar500: string;
    leftEar1000: string;
    leftEar2000: string;
    leftEar4000: string;
  };
  spirometry: 'normal' | 'abnormal' | '';
  ecg: 'normal' | 'abnormal' | '';
  physicianOpinion: {
    specialistOpinion: string;
    recommendations: string;
    referral: string;
    status: 'unrestricted' | 'conditional';
    referralDetails: string;
  };
}

export interface DuePersonnelInfo {
  personnel: Personnel;
  status: 'overdue' | 'dueSoon' | 'needsFirst';
  nextDueDate: string | null;
}

export type PatientType = 'complex' | 'contractor';

export interface ContractorInfo {
    firstName: string;
    lastName: string;
    age: string;
    nationalId: string;
    company: string;
}

export interface PrescribedMedication {
    medicineId: string;
    quantity: number;
}

export interface VisitRecord {
    id: string;
    visitDate: string;
    reason: string;
    diagnosis: string;
    recommendations: string;
    physicianName: string;
    patientType: PatientType;
    personnelId?: string;
    contractorInfo?: ContractorInfo;
    prescribedMedications?: PrescribedMedication[];
    actionResult: 'returnToWork' | 'referral' | 'hospitalDispatch';
    hospitalDispatchDetails?: {
        driverName: string;
        dispatchTime: string;
    };
    consultingPhysicianName: string;
    hasElectronicPrescription: boolean;
    electronicPrescriptionCode?: string;
}

export interface Medicine {
    id: string;
    name: string;
    type: string;
    stock: number;
}

export type IncidentParty = 'complex' | 'contractor';

export interface Incident {
  id: string;
  date: string;
  location: string;
  description: string;
  party: IncidentParty;
  contractorName?: string;
  severity: 'minor' | 'moderate' | 'serious' | 'fatal';
  correctiveActions: string;
  status: 'open' | 'investigating' | 'closed';
}

// Checklist System Types
export interface ChecklistCategory {
  id: string;
  name: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface Checklist {
  id: string;
  categoryId: string;
  title: string;
  items: ChecklistItem[];
}

export type ChecklistSubmissionStatus = 'pass' | 'fail' | 'na';

export interface ChecklistSubmissionItem {
  itemId: string;
  status: ChecklistSubmissionStatus;
  comment: string;
}

export interface ChecklistSubmission {
  id: string;
  checklistId: string;
  date: string;
  location: string;
  performedBy: string;
  items: ChecklistSubmissionItem[];
}

// Fire Department Types
export interface FireEquipmentTypeConfig {
  id: string;
  name: string;
}

export type FireEquipmentStatus = 'operational' | 'needs_service' | 'out_of_service';

export interface FireEquipment {
  id: string;
  tag: string; // e.g., EXT-A1-01
  typeId: string; // References FireEquipmentTypeConfig.id
  location: string;
  installDate: string; // Jalali date
  lastInspectionDate: string; // Jalali date
  nextInspectionDate: string; // Jalali date
  status: FireEquipmentStatus;
}