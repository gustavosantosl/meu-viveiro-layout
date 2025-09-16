import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, MoreHorizontal, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, Task } from "@/hooks/useTasks";
import { useCultivationCycles } from "@/hooks/useCultivationCycles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const taskSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  ciclo_id: z.string().optional(),
  status: z.enum(["pendente", "em progresso", "concluída"]),
  data_limite: z.date().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const StatusIcon = ({ status }: { status: Task['status'] }) => {
  switch (status) {
    case 'concluída':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'em progresso':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'pendente':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  }
};

const StatusBadge = ({ status }: { status: Task['status'] }) => {
  const variants = {
    'pendente': 'secondary',
    'em progresso': 'default',
    'concluída': 'outline'
  } as const;

  const labels = {
    'pendente': 'Pendente',
    'em progresso': 'Em Progresso',
    'concluída': 'Concluída'
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

function TaskForm({ task, onClose }: { task?: Task; onClose: () => void }) {
  const { data: cycles = [] } = useCultivationCycles();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      titulo: task?.titulo || "",
      descricao: task?.descricao || "",
      ciclo_id: task?.ciclo_id || "",
      status: task?.status || "pendente",
      data_limite: task?.data_limite ? new Date(task.data_limite) : undefined,
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = {
        titulo: data.titulo,
        descricao: data.descricao || null,
        ciclo_id: data.ciclo_id || null,
        status: data.status,
        responsavel_id: null, // Will be enhanced later with employee management
        data_limite: data.data_limite ? format(data.data_limite, 'yyyy-MM-dd') : null,
      };

      if (task) {
        await updateTask.mutateAsync({ id: task.id, ...taskData });
      } else {
        await createTask.mutateAsync(taskData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o título da tarefa" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Descrição detalhada da tarefa" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ciclo_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciclo de Cultivo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar ciclo (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.nome_ciclo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em progresso">Em Progresso</SelectItem>
                  <SelectItem value="concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_limite"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data Limite</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createTask.isPending || updateTask.isPending}>
            {task ? 'Atualizar' : 'Criar'} Tarefa
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Tarefas() {
  const { data: tasks = [], isLoading } = useTasks();
  const deleteTask = useDeleteTask();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask.mutateAsync(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Tarefas</h1>
          <p className="text-muted-foreground">
            Organize e acompanhe as tarefas da sua fazenda de camarão
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Adicione uma nova tarefa para organizar o trabalho na fazenda.
              </DialogDescription>
            </DialogHeader>
            <TaskForm onClose={() => setIsCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Você não possui nenhuma tarefa registrada. Crie sua primeira tarefa para começar a organizar o trabalho.
            </p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              Criar Primeira Tarefa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <StatusIcon status={task.status} />
                    <div>
                      <CardTitle className="text-lg">{task.titulo}</CardTitle>
                      {task.descricao && (
                        <CardDescription>{task.descricao}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={task.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(task.id)}
                          className="text-destructive"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Criada em {format(new Date(task.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                  {task.data_limite && (
                    <span>
                      Prazo: {format(new Date(task.data_limite), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
              <DialogDescription>
                Atualize os detalhes da tarefa.
              </DialogDescription>
            </DialogHeader>
            <TaskForm task={selectedTask} onClose={() => setSelectedTask(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}