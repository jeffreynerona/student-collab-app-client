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
    const { content, id, index, task } = this.props;
    return (
      <Draggable
        draggableId={task.id}
        index={index}
      >
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            {task.content}
          </Container>
        )}
      </Draggable>
    );
  }
}