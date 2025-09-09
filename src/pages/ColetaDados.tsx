import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ColetaDados = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Coleta de Dados</h1>
        <p className="text-muted-foreground font-inter">Monitoramento e análise de dados aquícolas</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Coleta de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de coleta de dados. Aqui você poderá registrar informações sobre 
            clima, solo, pragas, doenças e outros dados importantes para o manejo da fazenda.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColetaDados;