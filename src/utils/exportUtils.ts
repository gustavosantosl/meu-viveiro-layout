import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { CultivationCycle } from '@/hooks/useCultivationCycles';

export interface CycleComparisonData {
  nome_ciclo: string;
  periodo: string;
  fca_final: number | null;
  sobrevivencia_final: number | null;
  peso_final_despesca: number | null;
  receita_total: number | null;
  dias_cultivo: number;
}

export const exportToPDF = async (data: CycleComparisonData[], chartElementId?: string) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;

  // Add title
  pdf.setFontSize(20);
  pdf.text('Relatório Comparativo de Ciclos', margin, 30);

  // Add date
  pdf.setFontSize(10);
  pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, 45);

  let yPosition = 60;

  // Add table headers
  pdf.setFontSize(12);
  pdf.text('Ciclo', margin, yPosition);
  pdf.text('Período', margin + 40, yPosition);
  pdf.text('FCA Final', margin + 80, yPosition);
  pdf.text('Sobrevivência', margin + 120, yPosition);
  pdf.text('Receita (R$)', margin + 160, yPosition);

  yPosition += 10;

  // Add data rows
  pdf.setFontSize(10);
  data.forEach((cycle) => {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 30;
    }

    pdf.text(cycle.nome_ciclo, margin, yPosition);
    pdf.text(cycle.periodo, margin + 40, yPosition);
    pdf.text(cycle.fca_final?.toFixed(2) || 'N/A', margin + 80, yPosition);
    pdf.text(cycle.sobrevivencia_final?.toFixed(1) + '%' || 'N/A', margin + 120, yPosition);
    pdf.text('R$ ' + (cycle.receita_total?.toFixed(2) || '0,00'), margin + 160, yPosition);

    yPosition += 15;
  });

  // Add chart if element provided
  if (chartElementId) {
    const chartElement = document.getElementById(chartElementId);
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL('image/png');
        
        pdf.addPage();
        pdf.setFontSize(16);
        pdf.text('Gráficos Comparativos', margin, 30);
        
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', margin, 50, imgWidth, imgHeight);
      } catch (error) {
        console.error('Erro ao capturar gráfico:', error);
      }
    }
  }

  pdf.save('relatorio-ciclos.pdf');
};

export const exportToExcel = (data: CycleComparisonData[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((cycle) => ({
      'Nome do Ciclo': cycle.nome_ciclo,
      'Período': cycle.periodo,
      'Dias de Cultivo': cycle.dias_cultivo,
      'FCA Final': cycle.fca_final?.toFixed(2) || 'N/A',
      'Sobrevivência Final (%)': cycle.sobrevivencia_final?.toFixed(1) || 'N/A',
      'Peso Final (kg)': cycle.peso_final_despesca?.toFixed(2) || 'N/A',
      'Receita Total (R$)': cycle.receita_total?.toFixed(2) || 'N/A',
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparativo de Ciclos');

  // Add summary sheet
  const summary = [
    ['Resumo do Relatório'],
    [''],
    ['Total de Ciclos', data.length],
    ['Média FCA', data.length > 0 ? (data.reduce((sum, c) => sum + (c.fca_final || 0), 0) / data.length).toFixed(2) : 'N/A'],
    ['Média Sobrevivência (%)', data.length > 0 ? (data.reduce((sum, c) => sum + (c.sobrevivencia_final || 0), 0) / data.length).toFixed(1) : 'N/A'],
    ['Receita Total (R$)', data.reduce((sum, c) => sum + (c.receita_total || 0), 0).toFixed(2)],
    [''],
    [`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  XLSX.writeFile(workbook, 'relatorio-ciclos.xlsx');
};

export const getAlertBadgeColor = (waterQuality: any[], dailyFeeding: any[]) => {
  // Check for critical alerts
  const hasCriticalOxygen = waterQuality.some(wq => wq.oxigenio_dissolvido && wq.oxigenio_dissolvido < 3);
  const avgMortalidade = dailyFeeding.length > 0 
    ? dailyFeeding.reduce((sum, feed) => sum + (feed.mortalidade_observada || 0), 0) / dailyFeeding.length 
    : 0;
  
  if (hasCriticalOxygen || avgMortalidade > 5) {
    return 'destructive'; // Red
  }

  // Check for warning alerts
  const hasWarningPH = waterQuality.some(wq => wq.ph && (wq.ph < 6.5 || wq.ph > 9.0));
  
  if (hasWarningPH) {
    return 'secondary'; // Yellow
  }

  return 'default'; // Green/Normal
};