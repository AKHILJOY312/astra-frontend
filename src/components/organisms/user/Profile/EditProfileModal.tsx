import { Modal } from "@/components/molecules/user/profile/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues: {
    name: string;
    about: string;
    phone: string;
    link: string;
  };
  onSave: (values: Props["initialValues"]) => void;
};

const editProfileSchema = Yup.object({
  name: Yup.string().min(2, "Name is too short").required("Name is required"),

  about: Yup.string()
    .max(50, "About should be under 50 characters")
    .required("About is required"),

  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Invalid phone number")
    .required("Phone is required"),

  link: Yup.string().url("Enter a valid URL").nullable(),
});

const EditProfileModal = ({ open, onClose, initialValues, onSave }: Props) => {
  if (!open) return null;

  return (
    <Modal onClose={onClose} title="Edit Profile">
      <Formik
        initialValues={initialValues}
        validationSchema={editProfileSchema}
        enableReinitialize
        onSubmit={(values) => {
          onSave(values);
          onClose();
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <Field
                name="name"
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white outline-none"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="text-red-400 text-xs mt-1"
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                About
              </label>
              <Field
                as="textarea"
                rows={3}
                name="about"
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white outline-none resize-none"
                placeholder="A short bio about you"
              />
              <ErrorMessage
                name="about"
                component="p"
                className="text-red-400 text-xs mt-1"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <Field
                name="phone"
                type="tel"
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white outline-none"
                placeholder="+91 9876543210"
              />
              <ErrorMessage
                name="phone"
                component="p"
                className="text-red-400 text-xs mt-1"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website / Link
              </label>
              <Field
                name="link"
                type="url"
                className="w-full bg-[#1a1d21] border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 rounded-lg text-white outline-none"
                placeholder="https://example.com"
              />
              <ErrorMessage
                name="link"
                component="p"
                className="text-red-400 text-xs mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !dirty}
              className={`
    w-full py-3 rounded-lg font-medium transition-all
    ${
      dirty
        ? "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl cursor-pointer"
        : "bg-gray-700 text-gray-400 cursor-not-allowed shadow-none"
    }
    ${isSubmitting ? "opacity-70" : ""}
  `}
            >
              {dirty ? "Save Changes" : "No Changes to Save"}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditProfileModal;
