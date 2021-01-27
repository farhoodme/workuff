import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import styles from "../styles/Navbar.module.css";
import Link from "next/link";
import { db } from "../database";

export default function Navbar({ task }) {
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (task) {
      db.getParents(task.id).then((result) => {
        setPath(result.reverse());
      });
    }
  }, [task]);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/">
          <a>
            <Icon.Home size={16} strokeWidth={1} />
          </a>
        </Link>
        {path.map((item) => {
          return item.id === task.id ? (
            <a key={item.id} className={styles.active}>
              {item.title}
            </a>
          ) : (
            <React.Fragment key={item.id}>
              <Link
                href={{
                  pathname: "/[id]",
                  query: { id: item.id },
                }}
              >
                <a>{item.title}</a>
              </Link>
              <Icon.ChevronRight size={16} strokeWidth={1} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
