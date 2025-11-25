import { Check, Trash2 } from "lucide-react";
import { Todo } from "@/types/todo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 animate-fade-in hover:shadow-md",
        todo.completed && "bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <h3 
            className={cn(
              "font-medium text-foreground transition-all duration-300",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p 
              className={cn(
                "text-sm text-muted-foreground mt-1",
                todo.completed && "line-through"
              )}
            >
              {todo.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {todo.completed && todo.completedAt 
              ? `Completed: ${new Date(todo.completedAt).toLocaleDateString()}`
              : `Created: ${new Date(todo.createdAt).toLocaleDateString()}`
            }
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
