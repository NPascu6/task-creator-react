
//import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

import { useState, useEffect } from 'react'


const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks')
    const data = await response.json()
    console.log(data)

    return data
  }

  const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await response.json()
    return data
  }

  const addTask = async (task) => {
    const response = await fetch(`http://localhost:5000/tasks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()
    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleReminder = async (id) => {
    const task = await fetchTask(id)
    console.log(task)
    const updatedTask = { ...task, reminder: !task.reminder }

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await response.json()

    setTasks(tasks.map(task => task.id === id ? { ...task, reminder: data.reminder } : task))
    console.log(id)
  }

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask} />
        <Route path='/' exact render={() => <>
          {showAddTask && <AddTask onAdd={addTask} />}
          {tasks.length > 0 ? <Tasks
            tasks={tasks}
            onDelete={deleteTask}
            onTogle={toggleReminder} /> : 'No tasks to show'}
          <Footer />
        </>}
        />
        <Route path='/about' component={About} />
      </div>
    </Router>
  );
}




// class App1 extends React.Component {
//   render(){
//     return <Header />
//   }
// }

export default App;
