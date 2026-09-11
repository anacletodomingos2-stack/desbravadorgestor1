import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Unit, AttendanceSession, FeePayment, ClubInfo } from '../types';
import { initialClubInfo, initialUnits, initialMembers, initialAttendanceSessions, initialFeePayments } from '../data/initialData';

interface ClubContextType {
  clubInfo: ClubInfo;
  units: Unit[];
  members: Member[];
  attendanceSessions: AttendanceSession[];
  feePayments: FeePayment[];
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  addAttendanceSession: (session: Omit<AttendanceSession, 'id'>) => void;
  updateAttendanceRecord: (sessionId: string, memberId: string, status: AttendanceSession['records'][0]['status'], uniform: AttendanceSession['records'][0]['uniform']) => void;
  toggleFeeStatus: (paymentId: string) => void;
  addFeePayment: (payment: Omit<FeePayment, 'id'>) => void;
  updateClubInfo: (info: Partial<ClubInfo>) => void;
  resetToDefaults: () => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLUB_INFO: 'desbravador_club_info_v1',
  UNITS: 'desbravador_units_v1',
  MEMBERS: 'desbravador_members_v1',
  ATTENDANCE: 'desbravador_attendance_v1',
  FEES: 'desbravador_fees_v1',
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubInfo, setClubInfo] = useState<ClubInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLUB_INFO);
    return saved ? JSON.parse(saved) : initialClubInfo;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UNITS);
    return saved ? JSON.parse(saved) : initialUnits;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : initialAttendanceSessions;
  });

  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEES);
    return saved ? JSON.parse(saved) : initialFeePayments;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLUB_INFO, JSON.stringify(clubInfo));
  }, [clubInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(feePayments));
  }, [feePayments]);

  const addMember = (newMemberData: Omit<Member, 'id'>) => {
    const id = `m-${Date.now()}`;
    const newMember: Member = { ...newMemberData, id };
    setMembers((prev) => [newMember, ...prev]);

    // Automatically create fee payment placeholder for current month
    const currentMonth = new Date().toISOString().slice(0, 7);
    setFeePayments((prev) => [
      ...prev,
      {
        id: `fee-${Date.now()}`,
        memberId: id,
        month: currentMonth,
        amount: 2000,
        status: 'pending',
      },
    ]);
  };

  const updateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addUnit = (unitData: Omit<Unit, 'id'>) => {
    const id = `u-${Date.now()}`;
    setUnits((prev) => [...prev, { ...unitData, id }]);
  };

  const addAttendanceSession = (sessionData: Omit<AttendanceSession, 'id'>) => {
    const id = `att-${Date.now()}`;
    setAttendanceSessions((prev) => [{ ...sessionData, id }, ...prev]);
  };

  const updateAttendanceRecord = (
    sessionId: string,
    memberId: string,
    status: AttendanceSession['records'][0]['status'],
    uniform: AttendanceSession['records'][0]['uniform']
  ) => {
    setAttendanceSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== sessionId) return sess;
        const exists = sess.records.some((r) => r.memberId === memberId);
        const updatedRecords = exists
          ? sess.records.map((r) =>
              r.memberId === memberId ? { ...r, status, uniform } : r
            )
          : [...sess.records, { memberId, status, uniform }];
        return { ...sess, records: updatedRecords };
      })
    );
  };

  const toggleFeeStatus = (paymentId: string) => {
    setFeePayments((prev) =>
      prev.map((p) => {
        if (p.id !== paymentId) return p;
        const isNowPaid = p.status === 'pending';
        return {
          ...p,
          status: isNowPaid ? 'paid' : 'pending',
          paidDate: isNowPaid ? new Date().toISOString().slice(0, 10) : undefined,
        };
      })
    );
  };

  const addFeePayment = (paymentData: Omit<FeePayment, 'id'>) => {
    const id = `fee-${Date.now()}`;
    setFeePayments((prev) => [{ ...paymentData, id }, ...prev]);
  };

  const updateClubInfo = (info: Partial<ClubInfo>) => {
    setClubInfo((prev) => ({ ...prev, ...info }));
  };

  const resetToDefaults = () => {
    setClubInfo(initialClubInfo);
    setUnits(initialUnits);
    setMembers(initialMembers);
    setAttendanceSessions(initialAttendanceSessions);
    setFeePayments(initialFeePayments);
    localStorage.removeItem(STORAGE_KEYS.CLUB_INFO);
    localStorage.removeItem(STORAGE_KEYS.UNITS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.FEES);
  };

  return (
    <ClubContext.Provider
      value={{
        clubInfo,
        units,
        members,
        attendanceSessions,
        feePayments,
        addMember,
        updateMember,
        deleteMember,
        addUnit,
        addAttendanceSession,
        updateAttendanceRecord,
        toggleFeeStatus,
        addFeePayment,
        updateClubInfo,
        resetToDefaults,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
