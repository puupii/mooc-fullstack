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
      },
      {
        name: 'timin terraria linna',
        exercises: 12,
        id: 4
      },
      {
        name: 'useless stuuff',
        exercises: 99,
        id: 5
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
      <Total parts = {course.parts} />
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

const Total = ({parts}) => {
  var total = parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0,
  );
  console.log(total);
  return(
    <div>
    <b> total number of exercises:  {total} </b>
    </div>
  )
}

export default App