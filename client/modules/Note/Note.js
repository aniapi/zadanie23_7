import React, { PropTypes } from 'react';
import Note from './Note';
import styles from './Notes.css';
import {DragSource, DropTarget} from 'react-dnd';
import {compose} from 'redux';
import ItemTypes from '../Kanban/itemTypes';

class Note extends React.Component {
  render() {
   const {
     connectDragSource,
     connectDropTarget,
     isDragging,
     editing,
     children,
    } = this.props;

    const dragSource = editing ? a => a : connectDragSource;

   return dragSource(connectDropTarget(
     <li
       className={styles.Note}
       style={{
         opacity: isDragging ? 0 : 1,
       }}
     >
       {children}
     </li>
   ));

  }
}

const Notes = ({ notes }) => {
  return (<ul className="notes">{notes.map((note) =>
    <Note
      id={note.id}
      key={note.id}
    >
      {note.task}
    </Note>
  )}</ul>);
};

Notes.propTypes = {
  notes: PropTypes.array,
};

const noteSource = {
  beginDrag(props) {
    return {
      id: props.id,
      laneId: props.laneId,
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();

    if (targetProps.id !== sourceProps.id) {
      targetProps.moveWithinLane(targetProps.laneId, targetProps.id, sourceProps.id);
    }
  }
};

export default compose(
  DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Note);