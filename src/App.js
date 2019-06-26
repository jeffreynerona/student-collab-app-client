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
    return (
      <DragDropContext
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
      </DragDropContext>
    );
  }
}

export default App;
