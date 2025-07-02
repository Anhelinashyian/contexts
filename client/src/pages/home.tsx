import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskModal } from "@/components/task-modal";
import type { Task } from "@shared/schema";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="app-container">
          {/* Header */}
          <div className="text-center pt-16 pb-8">
            <h1 className="app-title">
              Contexts
            </h1>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <div className="text-center space-y-4">
              {tasks.length === 0 && !isLoading ? (
                <>
                  <p className="text-lg text-gray-600 font-medium">
                    Press enter to create your first item
                  </p>
                  <div className="text-sm text-gray-500">
                    <kbd className="px-2 py-1 bg-white bg-opacity-60 rounded border text-xs font-mono">
                      Enter
                    </kbd>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-2xl space-y-3">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Add Task
                    </button>
                  </div>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div key={task.id} className="bg-white bg-opacity-80 rounded-lg border border-gray-200 p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">{task.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                        {task.comments && (
                          <p className="text-gray-500 text-xs mb-2 italic">{task.comments}</p>
                        )}
                        {task.context && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {task.context}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Press <kbd className="px-1 py-0.5 bg-white bg-opacity-60 rounded text-xs font-mono">Enter</kbd> to add another item
                  </div>
                </div>
              )}
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
