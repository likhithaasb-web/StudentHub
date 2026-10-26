/**
 * Attendance calculation, forecasting, and data analysis utilities
 * Provides exact mathematical calculations for student attendance tracking.
 */

/**
 * Calculates current attendance percentage
 * @param {number} attended - Number of classes attended
 * @param {number} held - Total classes held
 * @returns {number} Percentage from 0 to 100, rounded to 1 decimal place
 */
export const calculateAttendancePercentage = (attended, held) => {
  if (!held || held <= 0) return 0;
  if (!attended || attended <= 0) return 0;
  const percentage = (attended / held) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage * 10) / 10));
};

/**
 * Calculates additional consecutive classes needed to reach target percentage T (in percent, e.g. 75).
 * Formula: (Attended + x) / (Held + x) >= T/100
 * => x >= (T * Held - Attended) / (1 - T)
 */
export const calculateClassesNeeded = (attended, held, targetPercentage = 75) => {
  const T = targetPercentage / 100;

  if (held <= 0) {
    return {
      classesNeeded: 0,
      achievable: true,
      message: 'No classes have been recorded yet.',
    };
  }

  const currentPercent = (attended / held) * 100;
  if (currentPercent >= targetPercentage) {
    return {
      classesNeeded: 0,
      achievable: true,
      message: `You are currently at or above your ${targetPercentage}% target!`,
    };
  }

  // If target is 100% and a class was missed
  if (T >= 1) {
    if (attended < held) {
      return {
        classesNeeded: null,
        achievable: false,
        message: 'Cannot achieve 100% attendance because classes have already been missed.',
      };
    }
    return {
      classesNeeded: 0,
      achievable: true,
      message: 'You have 100% attendance!',
    };
  }

  const rawX = (T * held - attended) / (1 - T);
  const classesNeeded = Math.max(0, Math.ceil(rawX));

  return {
    classesNeeded,
    achievable: true,
    message: `Attend the next ${classesNeeded} consecutive ${classesNeeded === 1 ? 'class' : 'classes'} to reach ${targetPercentage}%.`,
    formulaText: `(${attended} + ${classesNeeded}) / (${held} + ${classesNeeded}) = ${calculateAttendancePercentage(attended + classesNeeded, held + classesNeeded)}%`,
  };
};

/**
 * Calculates how many classes a student can safely miss while remaining at or above target T.
 * Formula: Attended / (Held + m) >= T/100
 * => m <= (Attended / T) - Held
 */
export const calculateClassesCanMiss = (attended, held, targetPercentage = 75) => {
  const T = targetPercentage / 100;

  if (held <= 0 || attended <= 0 || T <= 0) {
    return {
      classesCanMiss: 0,
      message: 'Not enough class history yet.',
    };
  }

  const currentPercent = (attended / held) * 100;
  if (currentPercent < targetPercentage) {
    return {
      classesCanMiss: 0,
      message: `Attendance is currently below ${targetPercentage}%. Attend upcoming classes to avoid shortages.`,
    };
  }

  const maxHeld = attended / T;
  const classesCanMiss = Math.max(0, Math.floor(maxHeld - held));

  if (classesCanMiss === 0) {
    return {
      classesCanMiss: 0,
      message: 'On the margin! Missing the next class will drop your attendance below the target.',
    };
  }

  return {
    classesCanMiss,
    message: `You can safely miss ${classesCanMiss} ${classesCanMiss === 1 ? 'class' : 'classes'} and remain at or above ${targetPercentage}%.`,
  };
};

/**
 * Calculates overall attendance across all subjects
 */
export const calculateOverallAttendance = (subjects = []) => {
  if (!subjects || subjects.length === 0) {
    return { totalHeld: 0, totalAttended: 0, totalAbsent: 0, percentage: 0 };
  }

  const totalHeld = subjects.reduce((sum, s) => sum + (Number(s.held) || 0), 0);
  const totalAttended = subjects.reduce((sum, s) => sum + (Number(s.attended) || 0), 0);
  const totalAbsent = subjects.reduce((sum, s) => sum + (Number(s.absent) || (Number(s.held) - Number(s.attended)) || 0), 0);
  const percentage = calculateAttendancePercentage(totalAttended, totalHeld);

  return { totalHeld, totalAttended, totalAbsent, percentage };
};

/**
 * Derives subject statistics directly from attendance records array
 */
export const calculateSubjectStatsFromRecords = (subjectName, records = []) => {
  const subRecords = records.filter((r) => r.subject === subjectName);
  const attended = subRecords.filter((r) => r.status === 'Present').length;
  const absent = subRecords.filter((r) => r.status === 'Absent').length;
  const held = attended + absent;
  const percentage = calculateAttendancePercentage(attended, held);

  return {
    held,
    attended,
    absent,
    percentage,
    records: subRecords,
  };
};

/**
 * Formats a YYYY-MM-DD date into friendly readable text (e.g. "Mon, Oct 26, 2026")
 */
export const formatAttendanceDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      const today = new Date();
      if (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      ) {
        return `Today, ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }

      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};
