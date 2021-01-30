import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async() => {
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)
    }   

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      })

    const data = await res.json()

    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE'})

    setTasks(tasks.filter((task) => {
      return task.id !== id
    }))
  }

  const toggleReminder = (id) => {
    setTasks(tasks.map((task) => {
      return (task.id === id ? { ...task, reminder: !task.reminder } : task)
    }))
  }

  return (
    <Router>
      <div className="container">
        <Header onAdd={ () => setShowAddTask(!showAddTask) } 
          showAdd={ showAddTask }
        />
        <Route path='/' exact render={ (props) => {
          return (
            <div>
              { showAddTask && <AddTask onAdd={ addTask } /> }
              { 
                tasks.length > 0 ? <Tasks tasks={ tasks } onDelete={ deleteTask } onToggle={ toggleReminder } /> : 'No Task to Show'
              }
            </div>
          )
          }} 
        />
        <Route path='/about' component={ About } />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
