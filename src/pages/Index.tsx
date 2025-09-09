import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Sprout, BarChart3, Package, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo ao Meu Viveiro
        </h1>
        <p className="text-lg text-muted-foreground">
          Sistema completo de gestão agrícola para sua propriedade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-elegant transition-shadow">
          <CardHeader className="text-center">
            <Sprout className="h-12 w-12 mx-auto text-secondary mb-2" />
            <CardTitle className="text-lg">Cultivo</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Gerencie plantações e cronogramas
            </p>
            <Button asChild variant="secondary" size="sm">
              <NavLink to="/cultivo">Acessar</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-shadow">
          <CardHeader className="text-center">
            <Package className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Estoque</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Controle insumos e produtos
            </p>
            <Button asChild variant="default" size="sm">
              <NavLink to="/estoque">Acessar</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-shadow">
          <CardHeader className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-success mb-2" />
            <CardTitle className="text-lg">Dados</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Monitore e colete informações
            </p>
            <Button asChild variant="outline" size="sm">
              <NavLink to="/coleta-dados">Acessar</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elegant transition-shadow">
          <CardHeader className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-warning mb-2" />
            <CardTitle className="text-lg">Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Acompanhe receitas e despesas
            </p>
            <Button asChild variant="outline" size="sm">
              <NavLink to="/financeiro">Acessar</NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">Dashboard Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema de gestão Meu Viveiro! Use o menu lateral para navegar 
            entre as diferentes seções do sistema. Cada módulo foi desenvolvido para 
            facilitar o gerenciamento completo da sua propriedade agrícola.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
