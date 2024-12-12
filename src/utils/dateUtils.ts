export function formatDate(date: string | Date | null | undefined): string {
  if (!date) {
    console.warn("Date is undefined or null:", date);
    return "No Date Provided";
  }

  // Converte string de data "YYYY-MM-DD" para Date
  let parsedDate: Date;
  if (typeof date === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      parsedDate = new Date(`${date}T00:00:00`); // Adiciona tempo padrão para evitar problemas
    } else {
      parsedDate = new Date(date);
    }
  } else {
    parsedDate = date;
  }

  // Verifica se a data é válida
  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    console.warn("Invalid date format:", date);
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate);
}
