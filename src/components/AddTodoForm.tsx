import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddTodoFormProps {
  onAdd: (title: string, description?: string) => void;
}

export const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    }
  };

  return (
    <Card className="p-4 shadow-md border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
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
          <div className="animate-fade-in">
            <Textarea
              placeholder="Add a description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
        )}
      </form>
    </Card>
  );
};
