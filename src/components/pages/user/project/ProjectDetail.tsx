import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import ChannelSidebar from "@/components/organisms/user/Channel/ChannelSidebar";
import MessageArea from "@/components/organisms/user/Message/MessageArea";
import { setCurrentProject } from "@/redux/slice/projectSlice";
import { useProjects } from "@/hooks/useProjects";
import { useChannels } from "@/hooks/useChannels";
import ViewMembersModal from "@/components/organisms/user/projects/ViewMembersModal";
import EditProjectModal from "@/components/organisms/user/projects/EditProjectModal";

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
    /* 1. h-full ensures we fill the height left by the Layout's header.
       2. overflow-hidden prevents the body from scrolling.
    */
    <div className="flex h-full w-full overflow-hidden bg-[#1A1D21]">
      {/* Sidebar: Stays on the left */}
      <ChannelSidebar />

      {/* Main Content Area: 
          'min-w-0' is crucial to prevent child content from pushing 
          the sidebar off-screen.
      */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeChannelId ? (
          /* MessageArea itself must be h-full and flex-1 */
          <MessageArea channelId={activeChannelId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-400">
                Welcome to the project
              </p>
              <p className="text-sm">Select a channel to start chatting</p>
            </div>
          </div>
        )}
      </main>

      {/* Modals outside the flow */}
      <ViewMembersModal projectId={projectId!} />
      <EditProjectModal />
    </div>
  );
}
