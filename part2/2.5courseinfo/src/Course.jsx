
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

export default Course
