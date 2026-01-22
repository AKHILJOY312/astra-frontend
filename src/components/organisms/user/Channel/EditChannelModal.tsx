import { useChannels } from "@/hooks/useChannels";
import type {
  ApiError,
  EditChannelModalProps,
  Permission,
  Role,
} from "@/types";
import { channelCreationSchema } from "@/utils/validators";
import { Formik, Form, Field, ErrorMessage } from "formik";

const roles: Role[] = ["manager", "lead", "member"];

export function EditChannelModal({
  projectId,
  channel,
  onClose,
}: EditChannelModalProps) {
  const { editChannel } = useChannels(projectId);

  const initialValues = {
    channelName: channel.channelName,
    description: channel.description || "",
    visibleToRoles: roles as Role[], // or channel.visibleToRoles if available
    permissionsByRole: channel.permissionsByRole,
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2D2F33] p-6 rounded-lg w-96 text-white shadow-2xl">
        <h3 className="text-2xl font-bold mb-6">Edit Channel</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={channelCreationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            setStatus(null);
            try {
              await editChannel(channel.id, {
                channelName: values.channelName.trim(),
                description: values.description.trim() || undefined,
                visibleToRoles: values.visibleToRoles,
                permissionsByRole: values.permissionsByRole,
              });

              onClose();
            } catch (error: unknown) {
              const err = error as ApiError;
              setStatus(
                err.response?.data?.message || "Could not update channel"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            setFieldValue,
            isSubmitting,
            isValid,
            status,
            dirty,
          }) => (
            <Form>
              {/* Channel Name */}
              <Field
                name="channelName"
                placeholder="Channel name"
                className="w-full px-4 py-3 bg-[#1A1D21] rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="channelName"
                component="div"
                className="text-red-400 text-sm mb-4"
              />

              {/* Description */}
              <Field
                as="textarea"
                name="description"
                placeholder="Description (optional)"
                className="w-full px-4 py-3 bg-[#1A1D21] rounded-lg mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-400 text-sm mb-6"
              />

              {/* Visible To Roles */}
              <p className="font-medium mb-3">Visible to:</p>
              <div className="flex gap-6 mb-1">
                {roles.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={values.visibleToRoles.includes(r)}
                      onChange={() => {
                        if (values.visibleToRoles.includes(r)) {
                          setFieldValue(
                            "visibleToRoles",
                            values.visibleToRoles.filter((x) => x !== r)
                          );
                        } else {
                          setFieldValue("visibleToRoles", [
                            ...values.visibleToRoles,
                            r,
                          ]);
                        }
                      }}
                      className="w-4 h-4 rounded accent-blue-500"
                    />
                    <span className="capitalize">{r}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage
                name="visibleToRoles"
                component="div"
                className="text-red-400 text-sm mb-6"
              />

              {/* Permissions */}
              <p className="font-medium mb-3">Permissions:</p>
              <div className="space-y-3">
                {roles.map((r) => (
                  <div key={r} className="flex items-center justify-between">
                    <span className="capitalize">{r}</span>
                    <select
                      value={values.permissionsByRole[r]}
                      onChange={(e) =>
                        setFieldValue(
                          `permissionsByRole.${r}`,
                          e.target.value as Permission
                        )
                      }
                      className="bg-[#1A1D21] px-3 py-2 rounded text-sm"
                    >
                      <option value="view">Can View</option>
                      <option value="message">Can Message</option>
                      <option value="manager">Can Manage</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Backend Error */}
              {status && (
                <div className="mt-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
                  {status}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="px-5 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg transition font-medium"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
