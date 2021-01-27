import Dexie from "dexie";
import relationships from "dexie-relationships";
import { v4 as uuidv4 } from "uuid";

const _db = new Dexie("TodoDatabase", { addons: [relationships] });

export class Database {
  constructor() {
    _db.version(1).stores({
      tasks:
        "id, parentId -> tasks.id, title, order, done, note, created, edited, expanded",
    });

    _db.on("populate", function () {
      _db.tasks.add({
        id: uuidv4(),
        parentId: 0,
        title: "Welcome to WorkUff task management",
        order: 1,
        done: false,
        note: "",
        created: new Date(),
        edited: new Date(),
        expanded: false,
      });
    });

    //_db.tasks.clear();
    //_db.delete();
  }

  insertTask = async (input) => {
    await _db.tasks
      .where("order")
      .above(input.order - 1)
      .and((item) => item.parentId === input.parentId)
      .modify((task) => ++task.order);

    const task = {
      id: input.id,
      parentId: input.parentId,
      title: input.title,
      order: input.order,
      done: false,
      note: "",
      created: new Date(),
      edited: new Date(),
      expanded: false,
    };
    await _db.tasks.add(task);
  };

  updateTaskTitle = async (input, title) => {
    await _db.tasks.update(input.id, { title });
  };

  expandTask = async (id, expanded) => {
    await _db.tasks.update(id, { expanded: expanded });
  };

  getAllTasks = async (parentId) => {
    const tasks = await _db.tasks
      .where("parentId")
      .equals(parentId)
      .with({ childs: "tasks" });

    return tasks.sort((a, b) => a.order - b.order);
  };

  getTaskById = async (id) => {
    if (id) {
      const task = await _db.tasks.where("id").equals(id).first();
      return task;
    }
    return null;
  };

  completeTaskToggle = async (id, isComplete) => {
    await _db.tasks.update(id, { done: isComplete, edited: new Date() });
  };

  deleteTask = async (id) => {
    const childs = await _db.tasks.where("parentId").equals(id).toArray();

    childs.map((item) => {
      this.deleteTask(item.id);
    });

    await _db.tasks.delete(id);
  };

  getParents = async (id, path = []) => {
    const task = await _db.tasks.where("id").equals(id).first();

    path.push(task);
    if (task.parentId === 0) {
      return path;
    }

    return this.getParents(task.parentId, path);
  };
}

export const db = new Database();
