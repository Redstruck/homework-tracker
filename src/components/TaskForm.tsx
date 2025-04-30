
import React, { useState, useEffect } from 'react';
import { Task } from '../lib/types';
import { generateId } from '../lib/aiHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  editingTask: Task | null;
  onTriggerChat: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onCancel, 
  editingTask,
  onTriggerChat
}) => {
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (editingTask) {
      setSubject(editingTask.subject);
      setName(editingTask.name);
      setDueDate(editingTask.dueDate);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for secret phrase
    if (name.trim().toLowerCase() === "openvault123") {
      onTriggerChat();
      return;
    }
    
    const task: Task = {
      id: editingTask?.id || generateId(),
      subject: subject.trim(),
      name: name.trim(),
      dueDate: dueDate,
      completed: editingTask?.completed || false
    };
    
    onSubmit(task);
    resetForm();
  };

  const resetForm = () => {
    setSubject('');
    setName('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-md border">
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Math, Science, English..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="name">Assignment Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Chapter 5 Problems, Essay Draft..."
          required
        />
      </div>
      
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
        >
          {editingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
