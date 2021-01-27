import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import styles from "../styles/Task.module.css";
import Task from "./Task";
import { v4 as uuidv4 } from "uuid";
import { db } from "../database";

export default function TaskList({ id, setChildsNull }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    db.getAllTasks(id).then((tasks) => {
      setTasks(tasks);
    });
  }, [id]);

  const onCreateTask = (order) => {
    const task = {
      id: uuidv4(),
      title: "",
      parentId: id,
      order,
      edited: new Date(),
    };

    db.insertTask(task);

    const lower = tasks.filter(function (el) {
      return el.order < task.order;
    });

    const upper = tasks.filter(function (el) {
      return el.order >= task.order;
    });

    upper.map((item) => ++item.order);

    const list = [...lower, task, ...upper].sort((a, b) => a.order - b.order);
    setTasks(list);
    console.log(list);
  };

  const handleLastCreate = () => {
    let order = 1;
    if (tasks.length > 0) {
      order = tasks[tasks.length - 1].order + 1;
    }
    onCreateTask(order);
  };

  const handleDelete = (id) => {
    db.deleteTask(id).then(() => {
      const list = tasks.filter(function (el) {
        return el.id !== id;
      });
      setTasks(list.sort((a, b) => a.order - b.order));
      if (list.length === 0) {
        if (setChildsNull) setChildsNull();
      }
    });
  };

  return (
    <div className={styles.project}>
      {tasks.map((item) => (
        <Task
          key={item.id}
          task={item}
          createTask={onCreateTask}
          deleteTask={handleDelete}
        />
      ))}
      <div className={styles.addChildButton} onClick={() => handleLastCreate()}>
        <Icon.Plus size={13} strokeWidth={1} />
      </div>
    </div>
  );
}
