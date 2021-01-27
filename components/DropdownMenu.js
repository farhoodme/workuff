import React, { useEffect, useRef, useState } from "react";
import * as Icon from "react-feather";
import moment from "moment";

export default function DropdownMenu({ task, onComplete, onDelete }) {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const onClick = () => setIsActive(!isActive);

  useEffect(() => {
    const pageClickEvent = (e) => {
      // If the active element exists and is clicked outside of
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks
    if (isActive) {
      window.addEventListener("click", pageClickEvent);
    }

    return () => {
      window.removeEventListener("click", pageClickEvent);
    };
  }, [isActive]);

  return (
    <div className={`menu-container ${isActive ? "active" : "inactive"}`}>
      <div className="menu-trigger" onClick={onClick}>
        <Icon.MoreHorizontal size={16} strokeWidth={3} />
      </div>
      <nav
        ref={dropdownRef}
        className={`menu ${isActive ? "active" : "inactive"}`}
      >
        <ul>
          <li onClick={() => onComplete(task.id)}>
            <span className="menu-title">
              <Icon.Check size={14} strokeWidth={2} className="menu-icon" />
              {task.done ? "Uncomplete" : "Complete"}
            </span>
            <span className="menu-helper">Ctrl+Enter</span>
          </li>
          <li onClick={() => onDelete(task.id)}>
            <span className="menu-title">
              <Icon.Trash2 size={14} strokeWidth={2} className="menu-icon" />
              Delete
            </span>
            <span className="menu-helper">Ctrl+Shift+Backspace</span>
          </li>
        </ul>
        <div className="menu-footer">
          <span>Last changed</span>
          <span>{moment(task.edited).format("MM/DD/YYYY, h:mm:ss A")}</span>
        </div>
      </nav>
    </div>
  );
}
