import React, { useState, useEffect } from 'react';
import {
  TextInput,
  TextArea,
  Button,
  Tag,
  FileUploader,
  Loading,
  Checkbox,
  OverflowMenu,
  OverflowMenuItem,
} from '@carbon/react';
import { 
  Add, 
  TrashCan, 
  Document, 
  ChevronDown, 
  ChevronRight,
  Calendar,
  User,
} from '@carbon/icons-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import './InternProjectBoard.scss';

interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'on_hold' | 'done';
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskUpdate {
  id: string;
  task_id: string;
  user_id: string;
  update_text: string;
  created_at: string;
}

interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string;
  created_at: string;
}

interface InternProjectBoardProps {
  projectId: string;
  userId: string;
}

const InternProjectBoard: React.FC<InternProjectBoardProps> = ({ projectId, userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: string } | null>(null);
  const [taskUpdates, setTaskUpdates] = useState<Record<string, TaskUpdate[]>>({});
  const [taskAttachments, setTaskAttachments] = useState<Record<string, TaskAttachment[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_project_tasks' as any, {
        p_project_id: projectId,
        p_user_id: userId
      });

      if (error) throw error;
      setTasks((data as Task[]) || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTaskDetails = async (taskId: string) => {
    try {
      const { data: updates, error: updatesError } = await (supabase as any)
        .from('intern_task_updates')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setTaskUpdates(prev => ({ ...prev, [taskId]: updates || [] }));

      const { data: attachments, error: attachmentsError } = await (supabase as any)
        .from('intern_task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (attachmentsError) throw attachmentsError;
      setTaskAttachments(prev => ({ ...prev, [taskId]: attachments || [] }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const { error } = await (supabase as any).from('intern_project_tasks').insert({
        project_id: projectId,
        title: newTaskTitle,
        status: 'todo',
        created_by: userId,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      setNewTaskTitle('');
      setIsAddingTask(false);
      fetchTasks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, field: keyof Task, value: any) => {
    try {
      const { error } = await (supabase as any)
        .from('intern_project_tasks')
        .update({ [field]: value })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Task updated',
      });

      fetchTasks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await (supabase as any)
        .from('intern_project_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      // Immediately update local state to remove the task
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Clean up related state
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      
      setSelectedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      
      // Clean up task details
      setTaskUpdates(prev => {
        const newUpdates = { ...prev };
        delete newUpdates[taskId];
        return newUpdates;
      });
      
      setTaskAttachments(prev => {
        const newAttachments = { ...prev };
        delete newAttachments[taskId];
        return newAttachments;
      });

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      // Refetch on error to ensure consistency
      fetchTasks();
    }
  };

  const handleAddUpdate = async (taskId: string, updateText: string) => {
    if (!updateText.trim()) return;

    try {
      const { error } = await (supabase as any).from('intern_task_updates').insert({
        task_id: taskId,
        user_id: userId,
        update_text: updateText,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Update added',
      });

      fetchTaskDetails(taskId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (taskId: string, files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `task-attachments/${taskId}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      const { error: dbError } = await (supabase as any).from('intern_task_attachments').insert({
        task_id: taskId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: userId,
      });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'File uploaded',
      });

      fetchTaskDetails(taskId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleRowExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
      if (!taskUpdates[taskId]) {
        fetchTaskDetails(taskId);
      }
    }
    setExpandedRows(newExpanded);
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const getStatusBadge = (status: Task['status'], taskId: string) => {
    const statusConfig = {
      todo: { color: '#c4c4c4', label: 'To Do', bg: '#f5f5f5' },
      in_progress: { color: '#fdab3d', label: 'Working on it', bg: '#fff4e6' },
      on_hold: { color: '#e2445c', label: 'Stuck', bg: '#ffe6ea' },
      done: { color: '#00c875', label: 'Done', bg: '#e6f9f0' },
    };

    const config = statusConfig[status];
    return (
      <div
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: 500,
          display: 'inline-block',
          cursor: 'pointer',
        }}
        onClick={() => {
          const statuses: Task['status'][] = ['todo', 'in_progress', 'on_hold', 'done'];
          const currentIndex = statuses.indexOf(status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          handleUpdateTask(taskId, 'status', nextStatus);
        }}
      >
        {config.label}
      </div>
    );
  };

  const getPersonAvatar = (userId: string | null) => {
    if (!userId) {
      return (
        <div className="person-avatar empty">
          <User size={16} />
        </div>
      );
    }
    
    const initials = userId.substring(0, 2).toUpperCase();
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
    const colorIndex = userId.charCodeAt(0) % colors.length;
    
    return (
      <div 
        className="person-avatar"
        style={{ backgroundColor: colors[colorIndex] }}
        title={userId}
      >
        {initials}
      </div>
    );
  };

  if (isLoading && tasks.length === 0) {
    return <Loading description="Loading tasks..." />;
  }

  return (
    <div className="monday-board">
      <div className="board-header">
        <h3>Tasks</h3>
        <Button
          kind="primary"
          size="sm"
          renderIcon={Add}
          onClick={() => setIsAddingTask(true)}
        >
          New Task
        </Button>
      </div>

      <div className="board-table">
        {/* Table Header */}
        <div className="table-header">
          <div className="cell cell-checkbox">
            <Checkbox 
              id="select-all"
              labelText=""
              checked={selectedTasks.size === tasks.length && tasks.length > 0}
              onChange={() => {
                if (selectedTasks.size === tasks.length) {
                  setSelectedTasks(new Set());
                } else {
                  setSelectedTasks(new Set(tasks.map(t => t.id)));
                }
              }}
            />
          </div>
          <div className="cell cell-expand"></div>
          <div className="cell cell-task">Task</div>
          <div className="cell cell-person">Person</div>
          <div className="cell cell-status">Status</div>
          <div className="cell cell-date">Due Date</div>
          <div className="cell cell-actions"></div>
        </div>

        {/* New Task Row */}
        {isAddingTask && (
          <div className="table-row new-task-row">
            <div className="cell cell-checkbox"></div>
            <div className="cell cell-expand"></div>
            <div className="cell cell-task">
              <TextInput
                id="new-task-title"
                labelText=""
                placeholder="+ Add task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTask();
                  } else if (e.key === 'Escape') {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                  }
                }}
                autoFocus
              />
            </div>
            <div className="cell cell-person"></div>
            <div className="cell cell-status"></div>
            <div className="cell cell-date"></div>
            <div className="cell cell-actions">
              <Button
                kind="ghost"
                size="sm"
                onClick={handleCreateTask}
              >
                Save
              </Button>
              <Button
                kind="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Task Rows */}
        {tasks.map((task) => (
          <React.Fragment key={task.id}>
            <div className={`table-row ${expandedRows.has(task.id) ? 'expanded' : ''}`}>
              <div className="cell cell-checkbox">
                <Checkbox
                  id={`select-${task.id}`}
                  labelText=""
                  checked={selectedTasks.has(task.id)}
                  onChange={() => toggleTaskSelection(task.id)}
                />
              </div>
              <div className="cell cell-expand">
                <button
                  className="expand-button"
                  onClick={() => toggleRowExpansion(task.id)}
                >
                  {expandedRows.has(task.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>
              <div className="cell cell-task">
                {editingCell?.taskId === task.id && editingCell?.field === 'title' ? (
                  <TextInput
                    id={`edit-title-${task.id}`}
                    labelText=""
                    value={task.title}
                    onChange={(e) => {
                      const updatedTasks = tasks.map(t =>
                        t.id === task.id ? { ...t, title: e.target.value } : t
                      );
                      setTasks(updatedTasks);
                    }}
                    onBlur={() => {
                      handleUpdateTask(task.id, 'title', task.title);
                      setEditingCell(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateTask(task.id, 'title', task.title);
                        setEditingCell(null);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="editable-cell"
                    onClick={() => setEditingCell({ taskId: task.id, field: 'title' })}
                  >
                    {task.title}
                  </span>
                )}
              </div>
              <div className="cell cell-person">
                {getPersonAvatar(task.assigned_to)}
              </div>
              <div className="cell cell-status">
                {getStatusBadge(task.status, task.id)}
              </div>
              <div className="cell cell-date">
                {editingCell?.taskId === task.id && editingCell?.field === 'due_date' ? (
                  <input
                    type="date"
                    value={task.due_date ? task.due_date.split('T')[0] : ''}
                    onChange={(e) => {
                      handleUpdateTask(task.id, 'due_date', e.target.value);
                      setEditingCell(null);
                    }}
                    onBlur={() => setEditingCell(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="editable-cell date-cell"
                    onClick={() => setEditingCell({ taskId: task.id, field: 'due_date' })}
                  >
                    {task.due_date ? (
                      <>
                        <Calendar size={16} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </>
                    ) : (
                      <span className="empty-date">Set date</span>
                    )}
                  </span>
                )}
              </div>
              <div className="cell cell-actions">
                <OverflowMenu size="sm" flipped>
                  <OverflowMenuItem
                    itemText="Delete"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </OverflowMenu>
              </div>
            </div>

            {/* Expanded Row Details */}
            {expandedRows.has(task.id) && (
              <div className="expanded-content">
                <div className="expanded-section">
                  <h4>Description</h4>
                  {editingCell?.taskId === task.id && editingCell?.field === 'description' ? (
                    <TextArea
                      id={`edit-desc-${task.id}`}
                      labelText=""
                      value={task.description || ''}
                      onChange={(e) => {
                        const updatedTasks = tasks.map(t =>
                          t.id === task.id ? { ...t, description: e.target.value } : t
                        );
                        setTasks(updatedTasks);
                      }}
                      onBlur={() => {
                        handleUpdateTask(task.id, 'description', task.description);
                        setEditingCell(null);
                      }}
                      rows={3}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="editable-cell"
                      onClick={() => setEditingCell({ taskId: task.id, field: 'description' })}
                    >
                      {task.description || 'Click to add description...'}
                    </p>
                  )}
                </div>

                <div className="expanded-section">
                  <h4>Updates ({taskUpdates[task.id]?.length || 0})</h4>
                  <div className="updates-list">
                    {taskUpdates[task.id]?.map((update) => (
                      <div key={update.id} className="update-item">
                        <p>{update.update_text}</p>
                        <small>{new Date(update.created_at).toLocaleString()}</small>
                      </div>
                    ))}
                    <TextArea
                      id={`new-update-${task.id}`}
                      labelText=""
                      placeholder="Write an update..."
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddUpdate(task.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="expanded-section">
                  <h4>Attachments ({taskAttachments[task.id]?.length || 0})</h4>
                  <div className="attachments-list">
                    {taskAttachments[task.id]?.map((attachment) => (
                      <div key={attachment.id} className="attachment-item">
                        <Document size={16} />
                        <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                          {attachment.file_name}
                        </a>
                        <small>({Math.round((attachment.file_size || 0) / 1024)} KB)</small>
                      </div>
                    ))}
                    <FileUploader
                      labelTitle=""
                      labelDescription="Drop files here or click to upload"
                      buttonLabel="Add file"
                      filenameStatus="edit"
                      accept={['.jpg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx']}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) handleFileUpload(task.id, files);
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InternProjectBoard;

// Made with Bob, fixed with blood sweat and tears
