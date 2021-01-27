import Head from "next/head";
import Navbar from "../components/Navbar";
import TaskList from "../components/TaskList";

export default function Home() {
  return (
    <div>
      <Head>
        <title>WorkUff - Organize your tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className="main">
        <TaskList id={0} />
      </div>
    </div>
  );
}
