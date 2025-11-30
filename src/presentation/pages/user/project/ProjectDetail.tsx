// src/presentation/pages/user/ProjectDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ChannelSidebar from "@/presentation/components/user/common/ChannelSidebar";
import MessageArea from "@/presentation/components/user/common/MessageArea";
import { setCurrentProject } from "@/presentation/redux/slice/projectSlice";
import { useProjects } from "@/presentation/hooks/useProjects";

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const { projects } = useProjects();
  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        dispatch(setCurrentProject(project));
      }
    }
  }, [projectId, projects, dispatch]);

  return (
    <div className="flex-1 flex ">
      <ChannelSidebar />
      <MessageArea />
    </div>
  );
}
