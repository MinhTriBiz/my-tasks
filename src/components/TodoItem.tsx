import { useState } from "react";
import { Trash2, Pencil, Calendar, MapPin, Bell } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { EditTodoDialog } from "./EditTodoDialog";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    title: string,
    description?: string,
    dueDate?: Date,
    location?: string,
    reminderAt?: Date,
    reminderEnabled?: boolean
  ) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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

            {/* Additional details */}
            <div className="flex flex-wrap gap-3 mt-2">
              {todo.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(todo.dueDate, "dd/MM/yyyy", { locale: vi })}</span>
                </div>
              )}
              {todo.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{todo.location}</span>
                </div>
              )}
              {todo.reminderEnabled && (
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Bell className="h-3 w-3" />
                  <span>
                    {todo.reminderAt 
                      ? format(todo.reminderAt, "dd/MM/yyyy", { locale: vi })
                      : "Đã bật nhắc"}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {todo.completed && todo.completedAt 
                ? `Hoàn thành: ${format(todo.completedAt, "dd/MM/yyyy", { locale: vi })}`
                : `Tạo: ${format(todo.createdAt, "dd/MM/yyyy", { locale: vi })}`
              }
            </p>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <EditTodoDialog
        todo={todo}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={onUpdate}
      />
    </>
  );
};
