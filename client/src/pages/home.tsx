import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskModal } from "../components/task-modal";
import type { TaskWithContext, Context } from "shared/schema.ts";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<TaskWithContext[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: contexts = [], isLoading: contextsLoading } = useQuery<Context[]>({
    queryKey: ["/api/contexts"],
  });

  const tasksByContext = tasks.reduce((acc, task) => {
    const contextId = task.contextId || 'no-context';
    if (!acc[contextId]) {
      acc[contextId] = [];
    }
    acc[contextId].push(task);
    return acc;
  }, {} as Record<string | number, TaskWithContext[]>);

  const isLoading = tasksLoading || contextsLoading;

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isModalOpen) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyPress);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyPress);
    };
  }, [isModalOpen]);

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="app-container">
          {/* Header */}
          <div className="text-center pt-8 pb-6">
            <h1 className="app-title">Contexts</h1>
            <div className="mt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Add New Task
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 pb-8">
            {tasks.length === 0 && !isLoading ? (
              <div className="text-center py-16">
                <p className="text-lg text-gray-600 font-medium mb-4">
                  Press enter to create your first item
                </p>
                <div className="text-sm text-gray-500">
                  <kbd className="px-2 py-1 bg-white bg-opacity-60 rounded border text-xs font-mono">
                    Enter
                  </kbd>
                </div>
              </div>
            ) : isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Contexts with tasks */}
                {contexts.map((context) => {
                  const contextTasks = tasksByContext[context.id] || [];
                  return (
                    <div key={context.id} className="bg-white bg-opacity-60 rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: context.color }}
                        />
                        <h3 className="font-semibold text-gray-800">{context.name}</h3>
                        <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          {contextTasks.length}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {contextTasks.map((task) => (
                          <div key={task.id} className="bg-white bg-opacity-80 rounded-md border border-gray-100 p-3">
                            <h4 className="font-medium text-gray-800 text-sm mb-1">{task.name}</h4>
                            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
                            {task.comments && (
                              <p className="text-gray-500 text-xs italic line-clamp-1">{task.comments}</p>
                            )}
                          </div>
                        ))}
                        
                        {contextTasks.length === 0 && (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            No tasks yet
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Tasks without context */}
                {tasksByContext['no-context'] && tasksByContext['no-context'].length > 0 && (
                  <div className="bg-white bg-opacity-60 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                      <h3 className="font-semibold text-gray-800">No Context</h3>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {tasksByContext['no-context'].length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {tasksByContext['no-context'].map((task) => (
                        <div key={task.id} className="bg-white bg-opacity-80 rounded-md border border-gray-100 p-3">
                          <h4 className="font-medium text-gray-800 text-sm mb-1">{task.name}</h4>
                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
                          {task.comments && (
                            <p className="text-gray-500 text-xs italic line-clamp-1">{task.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500 mt-8">
              Press <kbd className="px-1 py-0.5 bg-white bg-opacity-60 rounded text-xs font-mono">Enter</kbd> to add a new task
            </div>
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
