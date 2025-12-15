// src/presentation/components/user/modals/EditProjectModal.tsx
import { X, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { closeEditProjectModal } from "@/presentation/redux/slice/uiSlice";
import { useProjects } from "@/presentation/hooks/useProjects";
import { useUi } from "@/presentation/hooks/useUi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProjectSuccess } from "@/presentation/redux/slice/projectSlice";

const EditProjectSchema = Yup.object({
  projectName: Yup.string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters")
    .required("Project name is required"),

  description: Yup.string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable(),
});

export default function EditProjectModal() {
  const dispatch = useDispatch();
  const { updateProject, loading, error, currentProject } = useProjects();
  const { editProjectModalOpen } = useUi();

  if (!editProjectModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-black">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button onClick={() => dispatch(closeEditProjectModal())}>
            <X />
          </button>
        </div>

        {/* Body */}
        {!currentProject ? (
          <div className="p-6 text-center text-gray-500">
            Loading project details...
          </div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              projectName: currentProject.projectName,
              description: currentProject.description ?? "",
            }}
            validationSchema={EditProjectSchema}
            onSubmit={async (values) => {
              await updateProject(currentProject.id, {
                projectName: values.projectName.trim(),
                description: values.description?.trim(),
              });

              dispatch(closeEditProjectModal());
            }}
          >
            {({ isValid, dirty }) => (
              <Form className="p-6 space-y-4">
                {/* Project Name */}
                <div>
                  <Field
                    name="projectName"
                    placeholder="Project name"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  <ErrorMessage
                    name="projectName"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Description */}
                <div>
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Description (optional)"
                    className="w-full px-4 py-3 border rounded-xl"
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Backend Error */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!dirty || !isValid || loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}
