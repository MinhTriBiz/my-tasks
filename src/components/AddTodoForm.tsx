import { useState } from "react";
import { Plus, Calendar, MapPin, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AddTodoFormProps {
  onAdd: (
    title: string,
    description?: string,
    dueDate?: Date,
    location?: string,
    reminderAt?: Date,
    reminderEnabled?: boolean
  ) => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [location, setLocation] = useState("");
  const [reminderAt, setReminderAt] = useState<Date | undefined>();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(
        title.trim(),
        description.trim() || undefined,
        dueDate,
        location.trim() || undefined,
        reminderAt,
        reminderEnabled
      );
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate(undefined);
      setLocation("");
      setReminderAt(undefined);
      setReminderEnabled(false);
      setIsExpanded(false);
      setShowAdvanced(false);
    }
  };

  return (
    <Card className="p-4 shadow-md border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Thêm task mới..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!title.trim()}
            className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {isExpanded && (
          <div className="animate-fade-in space-y-4">
            <Textarea
              placeholder="Thêm mô tả (không bắt buộc)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  Chi tiết thêm
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-2">
                {/* Due Date */}
                <div className="grid gap-2">
                  <Label className="text-sm">Thời gian</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
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
                </div>

                {/* Location */}
                <div className="grid gap-2">
                  <Label className="text-sm">Địa điểm</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nhập địa điểm..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10 h-9"
                    />
                  </div>
                </div>

                {/* Reminder */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Nhắc nhở</Label>
                    <Switch
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>
                  {reminderEnabled && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </form>
    </Card>
  );
};
