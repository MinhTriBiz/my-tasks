import { useState, useEffect } from "react";
import { Pencil, Save, Calendar, MapPin, Bell } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (
    id: string,
    title: string,
    description?: string,
    dueDate?: Date,
    location?: string,
    reminderAt?: Date,
    reminderEnabled?: boolean
  ) => void;
}

export const EditTodoDialog = ({ todo, open, onOpenChange, onSave }: EditTodoDialogProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate);
  const [location, setLocation] = useState(todo.location || "");
  const [reminderAt, setReminderAt] = useState<Date | undefined>(todo.reminderAt);
  const [reminderEnabled, setReminderEnabled] = useState(todo.reminderEnabled);

  useEffect(() => {
    if (open) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setDueDate(todo.dueDate);
      setLocation(todo.location || "");
      setReminderAt(todo.reminderAt);
      setReminderEnabled(todo.reminderEnabled);
    }
  }, [open, todo]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(
        todo.id,
        title.trim(),
        description.trim() || undefined,
        dueDate,
        location.trim() || undefined,
        reminderAt,
        reminderEnabled
      );
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa Task</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết cho task của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">Tiêu đề *</Label>
            <Input
              id="edit-title"
              placeholder="Nhập tiêu đề task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description">Mô tả</Label>
            <Textarea
              id="edit-description"
              placeholder="Thêm mô tả chi tiết..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>Thời gian</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                variant="ghost"
                size="sm"
                className="w-fit"
                onClick={() => setDueDate(undefined)}
              >
                Xóa ngày
              </Button>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-location">Địa điểm</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="edit-location"
                placeholder="Nhập địa điểm..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-reminder">Nhắc nhở</Label>
              <Switch
                id="edit-reminder"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>
            {reminderEnabled && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !reminderAt && "text-muted-foreground"
                    )}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    {reminderAt ? format(reminderAt, "PPP", { locale: vi }) : "Chọn ngày nhắc"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={reminderAt}
                    onSelect={setReminderAt}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
