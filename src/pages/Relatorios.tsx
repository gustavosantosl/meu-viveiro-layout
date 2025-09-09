import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground">Análises e relatórios gerenciais</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de relatórios. Aqui você poderá gerar relatórios detalhados 
            sobre produção, vendas, custos, produtividade e outros indicadores importantes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;