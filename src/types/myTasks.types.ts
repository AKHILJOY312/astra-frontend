export interface ProjectStats {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
  completionPercentage: number;
}

export interface ProjectGroup {
  projectId: string;
  projectTitle: string;
  stats: ProjectStats; // Added this
  tasks: MyTasks[];
}
export interface MyTasks {
  id: string;
  title: string;
  description?: string | null;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  hasAttachments: boolean;
}

export interface ProjectGroup {
  projectId: string;
  projectTitle: string;
  tasks: MyTasks[];
  stats: ProjectStats;
}
