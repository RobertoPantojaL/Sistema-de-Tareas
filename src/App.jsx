import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('todo-lists')
    return savedLists ? JSON.parse(savedLists) : [{ id: 'default', name: 'Mi Lista', todos: [] }]
  })
  const [currentListId, setCurrentListId] = useState('default')
  const [input, setInput] = useState('')
  const [listInput, setListInput] = useState('')

  useEffect(() => {
    localStorage.setItem('todo-lists', JSON.stringify(lists))
  }, [lists])

  const currentList = lists.find(list => list.id === currentListId)

  const addTodo = () => {
    if (input.trim() !== '') {
      setLists(lists.map(list => 
        list.id === currentListId 
          ? { ...list, todos: [...list.todos, { id: Date.now(), text: input, completed: false }] }
          : list
      ))
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setLists(lists.map(list => 
      list.id === currentListId 
        ? { ...list, todos: list.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )}
        : list
    ))
  }

  const deleteTodo = (id) => {
    setLists(lists.map(list => 
      list.id === currentListId 
        ? { ...list, todos: list.todos.filter(todo => todo.id !== id) }
        : list
    ))
  }

  const addList = () => {
    if (listInput.trim() !== '') {
      const newList = { id: Date.now().toString(), name: listInput, todos: [] }
      setLists([...lists, newList])
      setListInput('')
      setCurrentListId(newList.id)
    }
  }

  const exportData = () => {
    let exportText = 'SISTEMA DE TAREAS\n\n';
    lists.forEach(list => {
      exportText += `LISTA: ${list.name}\n`;
      list.todos.forEach(todo => {
        exportText += `- [${todo.completed ? 'X' : ' '}] ${todo.text}\n`;
      });
      exportText += '\n';
    });

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mis-tareas.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="App">
      <h1 className="title">Sistema de Tareas</h1>
      <div className="list-selector">
        <select 
          value={currentListId} 
          onChange={(e) => setCurrentListId(e.target.value)}
        >
          {lists.map(list => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
        <div className="new-list-input">
          <input 
            type="text" 
            value={listInput} 
            onChange={(e) => setListInput(e.target.value)}
            placeholder="Nombre de nueva lista"
          />
          <button onClick={addList}>Agregar Lista</button>
        </div>
      </div>
      <div className="input-container">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Agregar nueva tarea"
        />
        <button onClick={addTodo}>Agregar</button>
      </div>
      <AnimatePresence>
        {currentList && (
          <motion.ul className="todo-list">
            {currentList.todos.map(todo => (
              <motion.li 
                key={todo.id} 
                className={todo.completed ? 'completed' : ''}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <button onClick={exportData} className="export-button">Exportar Datos</button>
    </div>
  )
}

export default App

