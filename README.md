# Student Collab App Client

## Setup

### Initialize Project
1. create-react-app student-collab-client
2. cd student-collab-client
3. npm start
4. clean up index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

```
5. clean up App.js
```javascript
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnOrder: [],
      columns: {},
      tasks: {},
    };
  }

  render() {
    return 'Hello World';
  }
```
6. Get columns and tasks data from api
```
getData = async () => {
    const columnOrderData = await fetch('http://localhost:5000/api/v1/columnOrder');
    const columnOrder = await columnOrderData.json();
    const columnsData = await fetch('http://localhost:5000/api/v1/columns');
    const columns = await columnsData.json();
    const tasksData = await fetch('http://localhost:5000/api/v1/tasks');
    const tasks = await tasksData.json();
    this.setState({
      columnOrder: columnOrder.data,
      columns: columns.data,
      tasks: tasks.data,
    });
  }

  componentDidMount() {
    this.getData();
  }
```
7. Test if you really have the data
```
render() {
    const { columnOrder, columns, tasks } = this.state;
    console.log(columnOrder);
    return 'Hello World';
  }
```
8. Map the tasks and columns
```
render() {
    const { columnOrder, columns, tasks } = this.state;
    return columnOrder.map(colId => {
      const col = columns[colId];
      const tsk = col.taskIds.map(tskId => tasks[tskId]);
      return <Column key={col.id} column={col} tasks={tsk} />
    });
  }
```
9. Import Column
`import Column from './components/column';`
10. Create './components/column.js'
```
import React from 'react';

class Column extends React.Component {
  render() {
  	const { column } = this.props;
  	return column.title;
  }
}

export default Column;
```
11. install styled-components
`npm install --save styled-components @atlaskit/css-reset`
12. in App.js
`import '@atlaskit/css-reset';`
13. in column.js
```
import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;
const Title = styled.h3``;
const TaskList = styled.div``;

class Column extends React.Component {
  render() {
  	const { column } = this.props;
  	return (
  		<Container>
  		  <Title>{column.title}</Title>
  		  <TaskList>Tasks go here</TaskList>
  		</Container>);
  }
}

export default Column;
```
14. add some styling
```
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2 ease;
  background-color: white
  flex-grow: 1;
  min-height: 100px;
  `;
```
15. npm install --save react-beautiful-dnd

...TODO, improve step by step from here

16. finish up column container
```
import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2 ease;
  background-color: ${props => (props.isDraggingOver ? 'lightgrey' : 'white')}
  flex-grow: 1;
  min-height: 100px;
  `;

class Column extends React.Component {
  render() {
  	const { column, tasks } = this.props;
  	return (
  		<Container>
        <Title>{column.title}</Title>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              innerRef={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
  	);
  }
}

export default Column;
```
17. Create Tasks
```
import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2 ease;
  background-color: ${props => (props.isDragging ? 'royalblue' : 'white')};
  color: ${props => (props.isDragging ? 'white' : 'black')};
`;

export default class Task extends React.Component {
  render() {
    return (
      <Draggable
        draggableId={this.props.task.id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            {this.props.task.content}
          </Container>
        )}
      </Draggable>
    );
  }
}
```
18. Update App.js
```
import React from 'react';
import Column from './components/column';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';

const Container = styled.div`
    display: flex;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columnOrder: [],
      columns: {},
      tasks: {},
    };
  }

  getData = async () => {
    const columnOrderData = await fetch('http://localhost:5000/api/v1/columnOrder');
    const columnOrder = await columnOrderData.json();
    const columnsData = await fetch('http://localhost:5000/api/v1/columns');
    const columns = await columnsData.json();
    const tasksData = await fetch('http://localhost:5000/api/v1/tasks');
    const tasks = await tasksData.json();
    this.setState({
      columnOrder: columnOrder.data,
      columns: columns.data,
      tasks: tasks.data,
    });
  }

  componentDidMount() {
    this.getData();
  }


  onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId &&
    destination.index === source.index) {
        return;
    }
    //handle reordering
    const { columns } = this.state;
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];
    if (start === end) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...this.state,
        columns: {
          ...columns,
          [newColumn.id]: newColumn,
        },
      };
      this.setState(newState);
      return;
    }

    // Move to another list
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(end.taskIds);
    endTaskIds.splice(destination.index, 0 ,draggableId);
    const newEnd = {
      ...end,
      taskIds: endTaskIds,
    };
    const newState = {
      ...this.state,
      columns: {
        ...columns,
        [newEnd.id]: newEnd,
        [newStart.id]: newStart,
      },
    };
    this.setState(newState);
    return;
  }

  render() {
    const { columnOrder, columns, tasks } = this.state;
    return (<DragDropContext
      onDragEnd={this.onDragEnd}
      onDragStart={this.onDragStart}
    >
    <Container>
      {columnOrder.map(colId => {
        const col = columns[colId];
        const tsk = col.taskIds.map(tskId => tasks[tskId]);
        return <Column key={col.id} column={col} tasks={tsk} />
      })}
    </Container>
    </DragDropContext>);
  }
}

export default App;
```


### Start Project
1. `npm start`
2. Open [http://localhost:5000/api/v1/tasks](http://localhost:5000/api/v1/todos)
