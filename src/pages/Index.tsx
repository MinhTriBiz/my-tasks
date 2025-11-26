import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoItem } from "@/components/TodoItem";
import { FilterTabs } from "@/components/FilterTabs";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/useTodos";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { todos, filter, setFilter, addTodo, toggleTodo, deleteTodo, counts, isLoading } = useTodos();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserEmail(session.user.email || null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Lỗi khi đăng xuất");
    } else {
      toast.success("Đã đăng xuất thành công");
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                My Tasks
              </h1>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">
              Stay organized and productive
            </p>
            {userEmail && (
              <p className="text-sm text-muted-foreground mt-1">
                {userEmail}
              </p>
            )}
          </div>
        </header>

        {/* Add Todo Form */}
        <div className="mb-6">
          <AddTodoForm onAdd={addTodo} />
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <FilterTabs 
            currentFilter={filter} 
            onFilterChange={setFilter} 
            counts={counts}
          />
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === "completed" 
                  ? "No completed tasks yet"
                  : filter === "active"
                  ? "No active tasks"
                  : "No tasks yet"}
              </h3>
              <p className="text-muted-foreground">
                {filter === "all" && "Add your first task to get started!"}
                {filter === "active" && "All tasks are completed. Great job!"}
                {filter === "completed" && "Complete some tasks to see them here."}
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          )}
        </div>

        {/* Stats Footer */}
        {counts.all > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {counts.completed > 0 && (
              <p>
                You've completed {counts.completed} out of {counts.all} tasks! Keep it up! 🎉
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
