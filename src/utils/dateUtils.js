/**
 * Date and time utility functions for StudentHub
 */

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getFormattedCurrentDate = () => {
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date());
};

export const getCurrentDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    }
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

/**
 * Returns difference in calendar days from today (targetDate - today)
 */
export const getDaysRemaining = (targetDateString) => {
  if (!targetDateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let target;
  const parts = targetDateString.split('-');
  if (parts.length === 3) {
    target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    target = new Date(targetDateString);
  }
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

export const getCountdownLabel = (targetDateString) => {
  const days = getDaysRemaining(targetDateString);
  if (days < 0) {
    return { text: `${Math.abs(days)}d overdue`, isOverdue: true, isUrgent: true };
  }
  if (days === 0) {
    return { text: 'Today', isOverdue: false, isUrgent: true };
  }
  if (days === 1) {
    return { text: 'Tomorrow', isOverdue: false, isUrgent: true };
  }
  if (days <= 3) {
    return { text: `In ${days} days`, isOverdue: false, isUrgent: true };
  }
  return { text: `In ${days} days`, isOverdue: false, isUrgent: false };
};

export const formatTime12h = (time24) => {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  let hour = parseInt(h, 10);
  const minutes = m ? m.padStart(2, '0') : '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getLast7DaysList = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
    days.push({ date: dateStr, label: dayLabel });
  }
  return days;
};
