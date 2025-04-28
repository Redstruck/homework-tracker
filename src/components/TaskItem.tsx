
import React from 'react';
import { Task } from '../lib/types';
import { Check, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  return (
    <div className={`p-4 mb-2 border rounded-md ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6 rounded-full"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed && <Check className="h-4 w-4" />}
          </Button>
          <div className={`${task.completed ? 'line-through text-gray-500' : ''}`}>
            <h3 className="font-semibold text-sm">{task.subject}</h3>
            <p className="text-sm">{task.name}</p>
            <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
