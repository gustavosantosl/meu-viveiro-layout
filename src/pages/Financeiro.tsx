import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Financeiro = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Financeiro</h1>
        <p className="text-muted-foreground font-inter">Gestão financeira da carcinicultura</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página financeira. Aqui você poderá acompanhar receitas, despesas, 
            investimentos, fluxo de caixa e análises econômicas da propriedade.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;