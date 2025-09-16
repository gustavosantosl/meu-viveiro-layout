import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, Fish, FileText } from "lucide-react";
import { exportToPDF, exportToExcel, CycleComparisonData } from "@/utils/exportUtils";
import { useFinanceiro, useFinanceiroSummary } from "@/hooks/useFinanceiro";
import { useCultivationCycles, useBiometricData, useDailyFeeding } from "@/hooks/useCultivationCycles";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

const Relatorios = () => {
  const [periodo, setPeriodo] = useState<'dia' | 'mes' | 'ano'>('mes');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('');
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  
  const summary = useFinanceiroSummary(periodo);
  const { records } = useFinanceiro();
  const { data: cycles = [] } = useCultivationCycles();

  // Filtrar registros baseado na categoria
  const filteredRecords = useMemo(() => {
    if (!categoriaFilter || categoriaFilter === 'todas') return records;
    return records.filter(record => record.categoria === categoriaFilter);
  }, [records, categoriaFilter]);

  // Dados para gráfico de barras (faturamento mensal)
  const monthlyData = useMemo(() => {
    const monthlyStats: { [key: string]: number } = {};
    
    filteredRecords
      .filter(record => record.tipo === 'entrada')
      .forEach(record => {
        const month = format(parseISO(record.data), 'MMM yyyy', { locale: ptBR });
        monthlyStats[month] = (monthlyStats[month] || 0) + Number(record.valor);
      });

    return Object.entries(monthlyStats).map(([month, valor]) => ({
      month,
      valor
    }));
  }, [filteredRecords]);

  // Dados para gráfico de pizza (despesas por categoria)
  const expensesByCategory = useMemo(() => {
    const categoryStats: { [key: string]: number } = {};
    
    filteredRecords
      .filter(record => record.tipo === 'saida')
      .forEach(record => {
        categoryStats[record.categoria] = (categoryStats[record.categoria] || 0) + Number(record.valor);
      });

    return Object.entries(categoryStats).map(([categoria, valor]) => ({
      categoria,
      valor
    }));
  }, [filteredRecords]);

  // Dados para gráfico de linha (evolução diária do mês atual)
  const dailyEvolution = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return daysInMonth.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRecords = filteredRecords.filter(record => record.data === dayStr);
      
      const entradas = dayRecords
        .filter(r => r.tipo === 'entrada')
        .reduce((sum, r) => sum + Number(r.valor), 0);
      
      const saidas = dayRecords
        .filter(r => r.tipo === 'saida')
        .reduce((sum, r) => sum + Number(r.valor), 0);

      return {
        dia: format(day, 'dd/MM'),
        entradas,
        saidas
      };
    });
  }, [filteredRecords]);

  // Categorias únicas para o filtro
  const categorias = useMemo(() => {
    const uniqueCategories = [...new Set(records.map(record => record.categoria))];
    return uniqueCategories.sort();
  }, [records]);

  // Função para exportar CSV
  const exportToCsv = () => {
    const headers = ['Data', 'Categoria', 'Tipo', 'Valor', 'Descrição'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.data,
        record.categoria,
        record.tipo,
        record.valor,
        record.descricao || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-financeiro-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Get finalized cycles for comparison
  const finalizedCycles = cycles.filter(cycle => cycle.status === 'finalizado');

  // Calculate cycle metrics
  const calculateCycleMetrics = (cycle: any) => {
    const duration = differenceInDays(
      cycle.data_fim ? new Date(cycle.data_fim) : new Date(),
      new Date(cycle.data_povoamento)
    );
    
    return {
      id: cycle.id,
      nome: cycle.nome_ciclo,
      duracao: duration,
      biomassa_inicial: cycle.biomassa_inicial || 0,
      // These would be calculated from related data in a real implementation
      fca_final: 1.8, // Placeholder
      sobrevivencia_final: 85, // Placeholder
      biomassa_final: (cycle.biomassa_inicial || 0) * 1.5, // Placeholder
    };
  };

  // Prepare comparison data
  const comparisonData = selectedCycles.map(cycleId => {
    const cycle = cycles.find(c => c.id === cycleId);
    return cycle ? calculateCycleMetrics(cycle) : null;
  }).filter(Boolean);

  // FCA comparison chart data
  const fcaComparisonData = comparisonData.map(cycle => ({
    nome: cycle?.nome,
    fca: cycle?.fca_final
  }));

  // Biomass comparison chart data
  const biomassComparisonData = comparisonData.map(cycle => ({
    nome: cycle?.nome,
    biomassa: cycle?.biomassa_final
  }));

  const handleCycleSelection = (cycleId: string, checked: boolean) => {
    if (checked) {
      setSelectedCycles(prev => [...prev, cycleId]);
    } else {
      setSelectedCycles(prev => prev.filter(id => id !== cycleId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground font-inter">Dashboard financeiro e análises</p>
        </div>
        <Button onClick={exportToCsv} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 flex-wrap">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={periodo} onValueChange={(value: 'dia' | 'mes' | 'ano') => setPeriodo(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Dia</SelectItem>
                <SelectItem value="mes">Mês</SelectItem>
                <SelectItem value="ano">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do {periodo}</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.faturamento)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do {periodo}</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.despesas)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do {periodo}</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(summary.saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Barras - Faturamento Mensal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Faturamento por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Despesas por Categoria */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {expensesByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Linha - Evolução Diária */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Evolução Diária - {format(new Date(), 'MMMM yyyy', { locale: ptBR })}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="entradas" stroke="#22c55e" name="Entradas" />
              <Line type="monotone" dataKey="saidas" stroke="#ef4444" name="Saídas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparativo de Ciclos Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5" />
            Comparativo de Ciclos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cycle Selection */}
          <div>
            <h4 className="text-sm font-medium mb-3">Selecionar Ciclos Finalizados:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {finalizedCycles.map((cycle) => (
                <div key={cycle.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cycle.id}
                    checked={selectedCycles.includes(cycle.id)}
                    onCheckedChange={(checked) => handleCycleSelection(cycle.id, checked as boolean)}
                  />
                  <label htmlFor={cycle.id} className="text-sm">
                    {cycle.nome_ciclo}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedCycles.length > 0 && (
            <>
              {/* Comparison Table */}
              <div>
                <h4 className="text-sm font-medium mb-3">Tabela Comparativa:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ciclo</TableHead>
                      <TableHead>Duração (dias)</TableHead>
                      <TableHead>FCA Final</TableHead>
                      <TableHead>Sobrevivência (%)</TableHead>
                      <TableHead>Biomassa Final (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((cycle) => (
                      <TableRow key={cycle?.id}>
                        <TableCell className="font-medium">{cycle?.nome}</TableCell>
                        <TableCell>{cycle?.duracao}</TableCell>
                        <TableCell>{cycle?.fca_final.toFixed(2)}</TableCell>
                        <TableCell>{cycle?.sobrevivencia_final}%</TableCell>
                        <TableCell>{cycle?.biomassa_final.toFixed(1)} kg</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Comparison Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Comparação FCA:</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={fcaComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="fca" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Comparação Biomassa Final:</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={biomassComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="biomassa" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;