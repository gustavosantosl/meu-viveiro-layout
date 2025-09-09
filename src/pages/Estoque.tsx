import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Estoque = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
        <p className="text-muted-foreground">Controle de insumos e produtos</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de controle de estoque. Aqui você poderá gerenciar insumos, 
            sementes, fertilizantes, equipamentos e produtos colhidos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;