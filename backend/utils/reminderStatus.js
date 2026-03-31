export const getReminderStatus = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue ";
  if (diffDays <= 2) return "Urgent ";
  if (diffDays <= 5) return "Due Soon";

  return "Upcoming ";
};