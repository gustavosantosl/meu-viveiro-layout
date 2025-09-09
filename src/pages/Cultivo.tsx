import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Cultivo = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Cultivo</h1>
        <p className="text-muted-foreground font-inter">Gerencie viveiros e ciclos de carcinicultura</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Página Cultivo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta é a página de gestão de cultivo de camarão. Aqui você poderá acompanhar o 
            desenvolvimento dos viveiros, cronogramas de povoamento, alimentação, qualidade 
            da água e manejo dos camarões em cada ciclo produtivo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cultivo;