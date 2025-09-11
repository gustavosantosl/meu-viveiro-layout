import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { BarChart3, Package, DollarSign } from "lucide-react";
import { ShrimpIcon } from "@/components/icons/ShrimpIcon";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-3">
          Bem-vindo ao Meu Viveiro
        </h1>
        <p className="text-lg text-muted-foreground font-inter">
          Sistema completo de gestão para carcinicultura
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-aqua">
              <ShrimpIcon className="h-8 w-8 text-white" size={32} />
            </div>
            <CardTitle className="text-lg font-poppins font-semibold text-foreground">Cultivo</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6 font-inter">
              Gerencie viveiros e ciclos de criação
            </p>
            <Button asChild className="w-full font-medium">
              <NavLink to="/cultivo">Acessar Cultivo</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center shadow-aqua">
              <Package className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg font-poppins font-semibold text-foreground">Estoque</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6 font-inter">
              Controle insumos e produtos
            </p>
            <Button asChild variant="secondary" className="w-full font-medium">
              <NavLink to="/estoque">Acessar Estoque</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-accent flex items-center justify-center shadow-aqua">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg font-poppins font-semibold text-foreground">Dados</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6 font-inter">
              Monitore e colete informações
            </p>
            <Button asChild variant="success" className="w-full font-medium">
              <NavLink to="/coleta-dados">Acessar Dados</NavLink>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center shadow-aqua">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-lg font-poppins font-semibold text-foreground">Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6 font-inter">
              Acompanhe receitas e despesas
            </p>
            <Button asChild variant="outline" className="w-full font-medium border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
              <NavLink to="/financeiro">Acessar Financeiro</NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 bg-gradient-to-r from-card via-muted/20 to-card">
        <CardHeader>
          <CardTitle className="text-xl font-poppins font-semibold text-foreground">Dashboard Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-inter leading-relaxed">
            Bem-vindo ao sistema de gestão Meu Viveiro! Use o menu lateral para navegar 
            entre as diferentes seções do sistema. Cada módulo foi desenvolvido para 
            facilitar o gerenciamento completo da sua fazenda de camarão com tecnologia 
            moderna e interface intuitiva.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
