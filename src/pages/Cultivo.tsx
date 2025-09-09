import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cultivo = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cultivo</h1>
        <p className="text-muted-foreground">Gerencie o cultivo e plantações</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Cultivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de gestão de cultivo. Aqui você poderá acompanhar o desenvolvimento 
            das plantações, cronogramas de plantio, irrigação e cuidados com as culturas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cultivo;