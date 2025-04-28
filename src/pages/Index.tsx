
import React, { useState, useEffect } from 'react';
import { Task } from '../lib/types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import ChatInterface from '../components/ChatInterface';
import { generateId } from '../lib/aiHelpers';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showChat, setShowChat] = useState(false);

  // Load saved tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('homework-tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading saved tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('homework-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      setTasks([...tasks, { ...task, id: generateId() }]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTriggerChat = () => {
    setShowChat(true);
    setShowForm(false);
  };

  const handleExitChat = () => {
    setShowChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-6 px-4">
        {!showChat ? (
          <>
            <header className="mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Homework Tracker</h1>
              <p className="text-gray-500">Keep track of your assignments</p>
            </header>
            
            {showForm ? (
              <TaskForm 
                onSubmit={handleAddTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
                editingTask={editingTask}
                onTriggerChat={handleTriggerChat}
              />
            ) : (
              <TaskList 
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                onAddNew={() => setShowForm(true)}
              />
            )}
          </>
        ) : (
          <div className="h-[80vh]">
            <ChatInterface onExit={handleExitChat} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
