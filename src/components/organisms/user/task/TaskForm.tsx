import Button from "@/components/atoms/task/Button";
import FormField from "@/components/molecules/user/task/FormField";
import { Formik, Form } from "formik";
import * as Yup from "yup";



const TaskSchema = Yup.object({
    title: Yup.string().min(3).required(),
    description: Yup.string().optional(),
});

interface TaskFormValues {
    title: string;
    description?: string;
}

interface Props {
    initialValues?: TaskFormValues;
    onSubmit: (values: TaskFormValues) => Promise<void>;
}

export default function TaskForm({
    initialValues = { title: "", description: "" },
    onSubmit,
}: Props) {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={TaskSchema}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form className="flex flex-col gap-4">
                    <FormField
                        name="title"
                        label="Task Title"
                        placeholder="Enter task title"
                    />

                    <FormField
                        name="description"
                        label="Description"
                        placeholder="Optional details"
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2"
                    >
                        {isSubmitting ? "Saving..." : "Save Task"}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
