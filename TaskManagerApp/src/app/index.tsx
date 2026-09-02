import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export default function App() {
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [isTitleFocused, setIsTitleFocused] = useState<boolean>(false);
  const [isDateFocused, setIsDateFocused] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (taskTitle.trim() === '' || dueDate.trim() === '') {
      Alert.alert('Missing Info', 'Please enter both task title and due date.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      dueDate: dueDate.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setDueDate('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Student Header Card */}
      <View style={styles.headerCard}>
        <Text style={styles.title}>Student Task Manager Screen</Text>
        <Text style={styles.studentName}>Jonathan F Del Rosario</Text>
        <Text style={styles.studentCourse}>DCE-BSIT</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.statCardPending]}>
          <View style={styles.badgePending}>
            <Text style={styles.badgeTextPending}>⌛</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
        </View>

        <View style={[styles.statCard, styles.statCardCompleted]}>
          <View style={styles.badgeCompleted}>
            <Text style={styles.badgeTextCompleted}>✓</Text>
          </View>
          <View>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Input Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Add New Task</Text>

        <Text style={styles.inputLabel}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder={isTitleFocused ? '' : 'Enter task title...'}
          placeholderTextColor="#9CA3AF"
          value={taskTitle}
          onChangeText={setTaskTitle}
          onFocus={() => setIsTitleFocused(true)}
          onBlur={() => setIsTitleFocused(false)}
        />

        <Text style={styles.inputLabel}>Due Date & Time</Text>
        {Platform.OS === 'web' ? (
          <React.Fragment>
            {React.createElement('style', null, `
              input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                transform: scale(1.35);
                cursor: pointer;
                padding-right: 4px;
              }
            `)}
            {React.createElement('input', {
              type: 'datetime-local',
              value: dueDate,
              onChange: (e: any) => setDueDate(e.target.value),
              style: {
                backgroundColor: '#F1F5F9',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '16px',
                color: dueDate ? '#0F172A' : '#9CA3AF',
                marginBottom: '14px',
                border: '1px solid #E2E8F0',
                outline: 'none',
                width: '100%',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }
            })}
          </React.Fragment>
        ) : (
          <TextInput
            style={styles.input}
            placeholder={isDateFocused ? '' : 'YYYY-MM-DD HH:MM'}
            placeholderTextColor="#9CA3AF"
            value={dueDate}
            onChangeText={setDueDate}
            onFocus={() => setIsDateFocused(true)}
            onBlur={() => setIsDateFocused(false)}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={addTask} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <Text style={styles.sectionTitle}>My Task List ({tasks.length})</Text>
      
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks found. Add one above!</Text>
        </View>
      ) : (
        tasks.map((task) => (
          <View key={task.id} style={[styles.taskCard, task.completed && styles.taskCardDone]}>
            {/* Dimming is applied strictly to this left section when completed */}
            <TouchableOpacity 
              style={[styles.taskCheckbox, task.completed && styles.taskContentDone]} 
              onPress={() => toggleTask(task.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.circleIcon, task.completed ? styles.circleCompleted : styles.circlePending]}>
                <Text style={styles.checkText}>{task.completed ? '✓' : ''}</Text>
              </View>

              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>
                  {task.title}
                </Text>
                <Text style={styles.taskDate}> {task.dueDate.replace('T', ' ')}</Text>
              </View>
            </TouchableOpacity>

            {/* Unaffected, full-bright Delete Button */}
            <TouchableOpacity 
              style={styles.deleteBtn} 
              onPress={() => deleteTask(task.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0E7FF',
  },
  studentCourse: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statCardPending: {
    marginRight: 8,
  },
  statCardCompleted: {
    marginLeft: 8,
  },
  badgePending: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeTextPending: {
    fontSize: 16,
  },
  badgeCompleted: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeTextCompleted: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taskCardDone: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  taskContentDone: {
    opacity: 0.5,
  },
  taskCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  circlePending: {
    borderColor: '#94A3B8',
    backgroundColor: 'transparent',
  },
  circleCompleted: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  taskDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});