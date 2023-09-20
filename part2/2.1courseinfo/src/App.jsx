const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }


  return <Course course={course} />
}

const Course = ({course}) => {
  return (
    <div>
      <Header coursename = {course.name} />
      <Content parts = {course.parts} />
    </div>
  )
}

const Header = ({coursename}) => {
  return(
    <div>
    <h1> {coursename} </h1>
    </div>
  )
}

const Content = ({parts}) => {
    return(
      <ul>
      {parts.map(part => <li key={part.id}> {part.name} {part.exercises} </li>)}
      </ul>
    )
}

export default App
