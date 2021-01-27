import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import styles from "../styles/Details.module.css";
import TaskList from "../components/TaskList";
import DropdownMenu from "../components/DropdownMenu";
import ContentEditable from "react-contenteditable";
import { db } from "../database";

const TaskDetails = () => {
  const title = useRef("");
  const router = useRouter();
  const { id } = router.query;
  const [currentTask, setTask] = useState();

  useEffect(() => {
    db.getTaskById(id).then((task) => {
      setTask(task);
    });
  }, [id]);

  const handleChange = (e) => {
    title.current = e.target.value;
  };

  const handleKeyUp = (e) => {
    if (title.current) {
      db.updateTaskTitle(currentTask, title.current);
      setTask({ ...currentTask, title: title.current });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleComplete = (id) => {
    db.completeTaskToggle(id, !currentTask.done).then(() => {
      setTask({ ...currentTask, done: !currentTask.done });
    });
  };

  const handleDelete = (id) => {
    db.deleteTask(id).then(() => {
      if (currentTask.parentId !== 0) {
        router.push({
          pathname: "/[id]",
          query: { id: currentTask.parentId },
        });
      } else {
        router.push("/");
      }
    });
  };

  return (
    <div>
      <Head>
        <title>{currentTask.title} - WorkUff</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar task={currentTask} />

      <div className="main">
        {currentTask ? (
          <div>
            <div className="task">
              <div className={styles.options}>
                <DropdownMenu
                  task={currentTask}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                />
              </div>
              <div
                className={`${styles.title} ${
                  currentTask.done ? styles.done : ""
                }`}
              >
                <ContentEditable
                  tagName="b"
                  html={currentTask.title}
                  onKeyUp={handleKeyUp}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <TaskList id={currentTask.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TaskDetails;
