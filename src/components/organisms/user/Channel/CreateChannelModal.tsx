import { useChannels } from "@/hooks/useChannels";
import type {
  ApiError,
  CreateChannelModalProps,
  Permission,
  Role,
} from "@/types";
import { channelCreationSchema } from "@/utils/validators";
import { Formik, Form, Field, ErrorMessage } from "formik";

const roles: Role[] = ["manager", "lead", "member"];

export function CreateChannelModal({
  projectId,
  onClose,
}: CreateChannelModalProps) {
  const { createChannel } = useChannels(projectId);

  const initialValues = {
    channelName: "",
    description: "",
    visibleToRoles: roles as Role[],
    permissionsByRole: Object.fromEntries(
      roles.map((r) => [r, "view"])
    ) as Record<Role, Permission>,
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center text-white">
      <div className="bg-black p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Create Channel</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={channelCreationSchema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            setStatus(null);
            try {
              await createChannel(values);
              onClose();
            } catch (error: unknown) {
              const err = error as ApiError;
              setStatus(
                err.response?.data?.message ||
                  err.message ||
                  "Something went wrong"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, isSubmitting, setFieldValue, status }) => (
            <Form>
              {/* Channel Name */}
              <Field
                name="channelName"
                placeholder="Channel name"
                className="border p-2 rounded w-full mb-1 text-white"
              />
              <ErrorMessage
                name="channelName"
                component="div"
                className="text-red-400 text-sm mb-3"
              />

              {/* Description */}
              <Field
                as="textarea"
                name="description"
                placeholder="Description (optional)"
                className="border p-2 rounded w-full mb-1 text-white"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-400 text-sm mb-3"
              />

              {/* Visible Roles */}
              <p className="font-medium mb-1">Visible to roles:</p>
              <div className="flex gap-3 mb-1">
                {roles.map((r) => (
                  <label key={r} className="flex items-center gap-1">
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
                    />
                    {r}
                  </label>
                ))}
              </div>
              <ErrorMessage
                name="visibleToRoles"
                component="div"
                className="text-red-400 text-sm mb-3"
              />

              {/* Permissions */}
              <p className="font-medium mb-1">Permissions:</p>
              {roles.map((r) => (
                <div key={r} className="flex items-center justify-between mb-2">
                  <span>{r}</span>
                  <select
                    className="border p-1 rounded text-white"
                    value={values.permissionsByRole[r]}
                    onChange={(e) =>
                      setFieldValue(
                        `permissionsByRole.${r}`,
                        e.target.value as Permission
                      )
                    }
                  >
                    <option value="view">View</option>
                    <option value="message">Message</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              ))}

              {/* Backend Error */}
              {status && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg">
                  {status}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-black bg-gray-300 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
