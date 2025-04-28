
import React from 'react';
import { Task } from '../lib/types';
import TaskItem from './TaskItem';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onAddNew: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onAddNew
}) => {
  // Sort tasks: incomplete tasks first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <Button onClick={onAddNew} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>

      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No tasks yet. Add one to get started!</p>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
