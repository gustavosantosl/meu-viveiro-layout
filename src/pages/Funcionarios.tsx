import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Funcionarios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Funcionários</h1>
        <p className="text-muted-foreground">Gestão de recursos humanos</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de gestão de funcionários. Aqui você poderá administrar 
            colaboradores, escalas de trabalho, salários e atividades desenvolvidas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Funcionarios;