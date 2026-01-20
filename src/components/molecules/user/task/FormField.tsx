import Input from "@/components/atoms/task/Input";
import { useField } from "formik";


interface FormFieldProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
}

export default function FormField({
    name,
    label,
    type = "text",
    placeholder,
}: FormFieldProps) {
    const [field, meta] = useField(name);

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">
                {label}
            </label>

            <Input
                {...field}
                type={type}
                placeholder={placeholder}
                error={meta.touched ? meta.error : undefined}
            />
        </div>
    );
}
