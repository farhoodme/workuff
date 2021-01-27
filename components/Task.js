import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import * as Icon from "react-feather";
import styles from "../styles/Task.module.css";
import ContentEditable from "react-contenteditable";
import TaskList from "./TaskList";
import DropdownMenu from "./DropdownMenu";
import { db } from "../database";

export default function Task({ task, createTask, deleteTask }) {
  const title = useRef("");
  const inputElement = useRef();
  const [currentTask, setTask] = useState(task);
  const [isExpanded, setExpanded] = useState(task.expanded);

  useEffect(() => {
    if (inputElement.current && task.title === "") {
      inputElement.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    title.current = e.target.value;
    setTask({ ...currentTask, title: title.current });
  };

  const handleKeyUp = (e) => {
    if (title.current) {
      updateTask();
    }
  };

  const handleKeyDown = (e) => {
    const keyName = e.key;
    if (keyName == "Control") {
      return;
    }

    if (e.ctrlKey) {
      if (keyName === "Shift") return;

      if (e.shiftKey) {
        if (keyName === "Backspace") {
          deleteTask(currentTask.id);
        }
      } else {
        if (keyName === "Enter") {
          handleComplete(currentTask.id);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createTask(currentTask.order + 1);
      e.preventDefault();
    }
  };

  const updateTask = () => {
    db.updateTaskTitle(currentTask, title.current);
  };

  const handleExpand = () => {
    db.expandTask(currentTask.id, !isExpanded).then(() => {
      setExpanded(!isExpanded);
    });
  };

  const handleComplete = (id) => {
    const done = !currentTask.done;
    db.completeTaskToggle(id, done).then(() => {
      setTask({ ...task, done });
    });
  };

  const setTaskChildsNull = () => {
    if (currentTask) {
      db.expandTask(currentTask.id, false).then(() => {
        setExpanded(false);
        setTask({ ...task, childs: null });
      });
    }
  };

  return (
    <div className={styles.project}>
      <div className="task">
        <div className={styles.options}>
          {currentTask.childs && currentTask.childs.length > 0 ? (
            <div className={styles.expand} onClick={() => handleExpand()}>
              {isExpanded ? (
                <Icon.ChevronDown size={13} strokeWidth={3} />
              ) : (
                <Icon.ChevronRight size={13} strokeWidth={3} />
              )}
            </div>
          ) : null}
          <DropdownMenu
            task={currentTask}
            onComplete={handleComplete}
            onDelete={deleteTask}
          />
        </div>
        <Link
          href={{
            pathname: "/[id]",
            query: { id: currentTask.id },
          }}
        >
          <a
            className={`${styles.bullet} ${
              currentTask.childs && currentTask.childs.length > 0
                ? styles.hasChild
                : ""
            }`}
          >
            <svg viewBox="0 0 18 18" fill="currentColor">
              <circle cx="9" cy="9" r="3.5"></circle>
            </svg>
          </a>
        </Link>
        <ContentEditable
          suppressContentEditableWarning
          spellCheck={false}
          innerRef={inputElement}
          tagName="span"
          className={`${styles.content} ${currentTask.done ? styles.done : ""}`}
          html={currentTask.title}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="children">
        {isExpanded ? (
          <TaskList id={currentTask.id} setChildsNull={setTaskChildsNull} />
        ) : null}
      </div>
    </div>
  );
}
