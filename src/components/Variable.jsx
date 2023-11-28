import React from 'react';
import { useDrag } from 'react-dnd';

function Variable({ name }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'VARIABLE',
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Updated styles for better visual appearance
  const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    margin: '1.5rem',
    cursor: 'move',
    float: 'left',
    opacity: isDragging ? 0.4 : 1,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '3px'
  };

  return (
    <div ref={drag} style={style}>
      {name}
    </div>
  );
}

export default Variable;
