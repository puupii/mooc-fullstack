const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]  

  const Header = (props) => {
    return (
      <div>
        <h1> {props.course} </h1>
      </div>
    )
  }

  const Part = (props) => {
    return (
      <div>
        <p> {props.name} {props.exercises} </p>
      </div>
    )
  }

  const Content = (props) => {
    return (
      <div>
        <Part name={props.parts[0].name} exercises={props.parts[0].exercises} />
        <Part name={props.parts[1].name} exercises={props.parts[1].exercises} />
        <Part name={props.parts[2].name} exercises={props.parts[2].exercises} />
      </div>
    )
  }

  const Total = (props) => {
    let totalexercises = 0
    props.parts.forEach(part => {
      totalexercises += part.exercises;
    })
    return (
      <div>
        <p> Number of exercises {totalexercises} </p>
      </div>
    )
  }

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App