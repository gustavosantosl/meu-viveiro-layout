import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Fazenda = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fazenda</h1>
        <p className="text-muted-foreground">Gerencie as informações da sua fazenda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Área Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">125 hectares</div>
            <p className="text-sm text-muted-foreground">Área cultivável disponível</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Setores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">8 setores</div>
            <p className="text-sm text-muted-foreground">Setores em produção</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Operacional</div>
            <p className="text-sm text-muted-foreground">Todos os sistemas funcionando</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Fazenda</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de gestão da fazenda. Aqui você poderá gerenciar informações sobre 
            a propriedade, setores de plantio, infraestrutura e muito mais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fazenda;