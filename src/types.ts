export type PathfinderClass = 
  | 'Amigo'
  | 'Companheiro'
  | 'Pesquisador'
  | 'Pioneiro'
  | 'Excursionista'
  | 'Guia'
  | 'Líder'
  | 'Líder Master';

export type RoleType = 
  | 'Desbravador'
  | 'Capitão'
  | 'Secretário de Unidade'
  | 'Conselheiro'
  | 'Conselheiro Associado'
  | 'Instrutor'
  | 'Secretário do Clube'
  | 'Tesoureiro'
  | 'Diretor Associado'
  | 'Diretor';

export interface Member {
  id: string;
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'M' | 'F';
  bloodType: string;
  allergies: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  unitId: string;
  currentClass: PathfinderClass;
  role: RoleType;
  admissionDate: string;
  isActive: boolean;
  notes?: string;
}

export interface Unit {
  id: string;
  name: string;
  gender: 'M' | 'F' | 'Misto';
  counselorName: string;
  counselorPhone?: string;
  color: string;
  motto: string;
}

export interface MemberAttendance {
  memberId: string;
  status: 'present' | 'late' | 'excused' | 'absent';
  uniform: 'full' | 'partial' | 'none';
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  date: string; // YYYY-MM-DD
  activityTitle: string;
  records: MemberAttendance[];
}

export interface FeePayment {
  id: string;
  memberId: string;
  month: string; // e.g., '2026-03'
  amount: number;
  paidDate?: string;
  status: 'paid' | 'pending';
}

export interface ClubInfo {
  name: string;
  churchName: string;
  association: string;
  directorName: string;
  year: number;
}
