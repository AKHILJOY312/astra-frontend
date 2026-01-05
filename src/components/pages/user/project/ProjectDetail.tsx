// src/presentation/pages/user/ProjectDetail.tsx
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ChannelSidebar from "@/components/organisms/user/common/ChannelSidebar";
import MessageArea from "@/components/organisms/user/common/MessageArea";
import { setCurrentProject } from "@/redux/slice/projectSlice";
import { useProjects } from "@/hooks/useProjects";
import { useChannels } from "@/hooks/useChannels";
import ViewMembersModal from "@/components/organisms/user/Projects/ViewMembersModal";
import EditProjectModal from "@/components/organisms/user/Projects/EditProjectModal";

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const { projects, loadProjects, loading } = useProjects();
  const { activeChannelId } = useChannels(projectId!);
  useEffect(() => {
    if (projects.length === 0 && !loading) {
      loadProjects();
    }
  }, [projects.length, loadProjects, loading]);
  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) dispatch(setCurrentProject(project));
    }
  }, [projectId, projects, dispatch]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <ChannelSidebar />

        <div className="flex-1 overflow-hidden flex">
          {activeChannelId ? (
            <MessageArea channelId={activeChannelId} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              ← Select a channel to start chatting
            </div>
          )}
        </div>
      </div>
      <ViewMembersModal projectId={projectId!} />
      <EditProjectModal />
    </div>
  );
}
