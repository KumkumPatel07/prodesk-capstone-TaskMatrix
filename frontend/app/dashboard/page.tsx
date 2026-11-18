"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Workspace {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
  workspaceId?: string;
}

interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string | null;
}

const initialForm = {
  projectId: "",
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
};

export default function DashboardPage() {
  const router = useRouter();

  // STATES
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // FETCH DASHBOARD DATA
  useEffect(() => {
    const fetchDashboard = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        router.replace("/login");
        return;
      }

      const authConfig = {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      };

      try {
        const profile = await API.get("/auth/me", authConfig);
        setUser(profile.data.user);

        const [
          workspaceResponse,
          projectResponse,
          taskResponse,
        ] = await Promise.all([
          API.get("/workspaces", authConfig),
          API.get("/projects", authConfig),
          API.get("/tasks", authConfig),
        ]);

        setWorkspaces(workspaceResponse.data);
        setProjects(projectResponse.data);
        setTasks(taskResponse.data);

        if (workspaceResponse.data.length > 0) {
          setSelectedWorkspace(workspaceResponse.data[0]._id);
        }

        if (projectResponse.data.length > 0) {
          setForm((prev) => ({
            ...prev,
            projectId: projectResponse.data[0]._id,
          }));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // CREATE WORKSPACE
  const handleCreateWorkspace = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!workspaceName.trim()) {
      setError("Please enter a workspace name.");
      return;
    }

    setSaving(true);

    try {
      const response = await API.post(
        "/workspaces",
        { name: workspaceName.trim() },
        config
      );

      const newWorkspace = response.data.workspace;

      setWorkspaces((prev) => [...prev, newWorkspace]);
      setSelectedWorkspace(newWorkspace._id);
      setWorkspaceName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create workspace. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // CREATE PROJECT
  const handleCreateProject = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!selectedWorkspace || !projectName.trim()) {
      setError("Please select a workspace and enter a project name.");
      return;
    }

    setSaving(true);

    try {
      const response = await API.post(
        "/projects",
        {
          workspaceId: selectedWorkspace,
          name: projectName.trim(),
          description: projectDescription.trim(),
        },
        config
      );

      const newProject = response.data.project;

      setProjects((prev) => [...prev, newProject]);

      setForm((prev) => ({
        ...prev,
        projectId: newProject._id,
      }));

      setProjectName("");
      setProjectDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // CREATE / UPDATE TASK
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!form.projectId || !form.title.trim()) {
      setError("Please select a project and enter a task title.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      title: form.title.trim(),
      dueDate: form.dueDate || null,
    };

    try {
      if (editingId) {
        const response = await API.put(
          `/tasks/${editingId}`,
          payload,
          config
        );

        setTasks((prev) =>
          prev.map((task) =>
            task._id === editingId ? response.data.task : task
          )
        );
      } else {
        const response = await API.post(
          "/tasks",
          payload,
          config
        );

        setTasks((prev) => [response.data.task, ...prev]);
      }

      setEditingId(null);

      setForm({
        ...initialForm,
        projectId: projects[0]?._id || "",
      });
    } catch (err) {
      console.error(err);
      setError("Unable to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // EDIT TASK
  const handleEdit = (task: Task) => {
    setEditingId(task._id);

    setForm({
      projectId: task.projectId,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.slice(0, 10)
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE TASK
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    const previousTasks = tasks;

    setTasks((prev) => prev.filter((task) => task._id !== id));
    setError("");

    try {
      await API.delete(`/tasks/${id}`, config);
    } catch (err) {
      console.error(err);
      setTasks(previousTasks);
      setError("Unable to delete task. Please try again.");
    }
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      ...initialForm,
      projectId: projects[0]?._id || "",
    });
  };

  // LOADING
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading TaskMatrix...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-blue-400">
          TaskMatrix
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600 px-5 py-2 font-medium hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <section className="mx-auto mt-10 max-w-6xl">
        <h2 className="text-3xl font-bold">
          Welcome, {user.name}!
        </h2>

        <p className="mt-2 text-slate-400">
          Manage your workspaces, projects and tasks from one place.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* DASHBOARD STATISTICS */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">My Projects</p>
            <h3 className="mt-2 text-3xl font-bold text-blue-400">
              {projects.length}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total Tasks</p>
            <h3 className="mt-2 text-3xl font-bold text-blue-400">
              {tasks.length}
            </h3>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Completed Tasks</p>
            <h3 className="mt-2 text-3xl font-bold text-green-400">
              {tasks.filter((task) => task.status === "Done").length}
            </h3>
          </div>
        </div>

        {/* CREATE WORKSPACE */}
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-bold">
            Create New Workspace
          </h3>

          <form
            onSubmit={handleCreateWorkspace}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <input
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 p-3"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Workspace"}
            </button>
          </form>
        </div>

        {/* CREATE PROJECT */}
        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-bold">
            Create New Project
          </h3>

          {workspaces.length === 0 ? (
            <p className="text-amber-300">
              Create a workspace first before creating a project.
            </p>
          ) : (
            <form
              onSubmit={handleCreateProject}
              className="grid gap-5 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Select Workspace
                </label>

                <select
                  required
                  value={selectedWorkspace}
                  onChange={(e) =>
                    setSelectedWorkspace(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  {workspaces.map((workspace) => (
                    <option
                      key={workspace._id}
                      value={workspace._id}
                    >
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Project Name
                </label>

                <input
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Project Description
                </label>

                <input
                  value={projectDescription}
                  onChange={(e) =>
                    setProjectDescription(e.target.value)
                  }
                  placeholder="Enter project description"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* CREATE / UPDATE TASK */}
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-6 text-xl font-bold">
            {editingId ? "Update Task" : "Create New Task"}
          </h3>

          {projects.length === 0 ? (
            <p className="text-amber-300">
              No projects found. Create a project before adding tasks.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Select Project
                </label>

                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      projectId: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Task Title
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter task title"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your task"
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Due Date
                </label>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
                />
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Task"
                      : "Create Task"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-lg bg-slate-700 px-6 py-3 hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* MY TASKS */}
        <div className="mt-10">
          <h3 className="mb-5 text-2xl font-bold">
            My Tasks
          </h3>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No tasks found. Create your first task above.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-bold">
                      {task.title}
                    </h4>

                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-300">
                      {task.priority}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    {task.description || "No description"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <span className="rounded-lg bg-slate-800 px-3 py-2">
                      {task.status}
                    </span>

                    <span className="rounded-lg bg-slate-800 px-3 py-2">
                      {projects.find(
                        (project) => project._id === task.projectId
                      )?.name || "Project"}
                    </span>
                  </div>

                  {task.dueDate && (
                    <p className="mt-3 text-sm text-slate-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}

                  <div className="mt-5 flex gap-3 border-t border-slate-800 pt-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold">Account Details</h3>

          <p className="mt-3 text-slate-300">
            Name: {user.name}
          </p>

          <p className="mt-2 text-slate-300">
            Email: {user.email}
          </p>
        </div>
      </section>
    </main>
  );
}