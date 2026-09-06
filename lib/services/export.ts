export async function exportToCSV(data: any[], filename: string): Promise<void> {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((key) => {
          const value = row[key];
          if (value == null) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportToPDF(data: any[], filename: string, title?: string): Promise<void> {
  const jsPDF = (await import('jspdf')).default;
  const doc = new jsPDF();

  if (title) {
    doc.setFontSize(16);
    doc.text(title, 14, 15);
  }

  doc.setFontSize(10);
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((key) => String(row[key] ?? '-')));

  let y = title ? 25 : 15;
  doc.setFontSize(9);
  doc.setTextColor(100);

  for (const header of headers) {
    doc.text(header, 14 + headers.indexOf(header) * 40, y);
  }
  y += 5;

  doc.setTextColor(0);
  for (const row of rows) {
    if (y > 280) {
      doc.addPage();
      y = 15;
    }
    for (const cell of row) {
      doc.text(cell, 14 + row.indexOf(cell) * 40, y);
    }
    y += 5;
  }

  doc.save(`${filename}.pdf`);
}

export async function exportToPNG(element: HTMLElement, filename: string): Promise<void> {
  console.log('[Export] PNG export requested for:', filename);
}
