"use client";

import React from "react";
import { Button, Input, Stack, Box, Textarea } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useForm, useFieldArray } from "react-hook-form";
import { editPoll } from "@/lib/polls";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Minus } from "lucide-react";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";

interface FormValues {
  title: string;
  statement: string;
  options: { value: string }[];
  startDate: Date | string;
  endDate: Date | string;
}

interface EditPollProps {
  pollId: string;
  currentData: {
    title: string;
    statement: string;
    options: string[];
    startDate: Date;
    endDate: Date;
  };
  onClose: () => void;
}

const EditPoll: React.FC<EditPollProps> = ({ pollId, currentData, onClose }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: currentData.title,
      statement: currentData.statement,
      options: currentData.options.map((opt) => ({ value: opt })),
      startDate: currentData.startDate,
      endDate: currentData.endDate,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = async (data: FormValues) => {
    if (!user?.uid) {
      toast.error("You must be logged in to edit the poll.");
      return;
    }

    if (new Date(data.startDate) >= new Date(data.endDate)) {
      toast.error("Start date must be before the end date.");
      return;
    }

    try {
      await editPoll(user.uid, pollId, {
        title: data.title,
        statement: data.statement,
        options: data.options.map((opt) => opt.value),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      });
      toast.success("Poll edited successfully!");
      onClose();
    } catch {
      toast.error("Failed to edit the poll. Please try again.");
    }
  };

  const handleDateChange = (
    date: string | moment.Moment,
    field: "startDate" | "endDate"
  ) => {
    if (moment.isMoment(date)) {
      setValue(field, date.toDate());
    } else {
      setValue(field, date);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4} className="w-full">
        <Field label="Poll Title" invalid={!!errors.title} errorText={errors.title?.message}>
          <Input
            placeholder="Enter poll title"
            {...register("title", { required: "Poll title is required" })}
            className="px-2 border dark:border-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-gray-500/50"
          />
        </Field>
        <Field label="Poll Statement" invalid={!!errors.statement} errorText={errors.statement?.message}>
          <Textarea
            placeholder="Enter poll statement"
            {...register("statement", { required: "Poll statement is required" })}
            className="px-2 border dark:border-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-gray-500/50"
          />
        </Field>

        <Field label="Options" invalid={!!errors.options?.[0]}>
          {fields.map((field, index) => (
            <Box key={field.id} className="flex items-center gap-2 mb-2 w-full">
              <Input
                placeholder={`Option ${index + 1}`}
                {...register(`options.${index}.value`, { required: "Option cannot be empty" })}
                className="px-2 border dark:border-gray-800 text-black dark:text-white transition-all duration-300 focus:ring-2 focus:ring-gray-500/50 rounded"
              />
              {fields.length > 2 && (
                <Button colorScheme="red" onClick={() => remove(index)}>
                  <Minus className="border-2 border-dashed border-red-600 hover:border-transparent hover:bg-red-600 hover:text-white transition-all duration-200 ease-linear" />
                </Button>
              )}
            </Box>
          ))}
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => append({ value: "" })}
            className="h-9 px-2 w-full border-2 border-dashed text-green-600 border-green-500 hover:border-transparent hover:bg-green-600 hover:text-white transition-all duration-200 ease-linear"
          >
            + Add another option
          </Button>
        </Field>

        <Field label="Start Date" invalid={!!errors.startDate} errorText={errors.startDate?.message}>
          <Datetime
            onChange={(date) => handleDateChange(date, "startDate")}
            inputProps={{
              placeholder: "Select start date and time",
              className: "w-full h-10 px-2 text-black dark:text-white transition-all duration-300 ",
            }}
            className="w-full focus:ring-2  border dark:border-gray-800  focus:ring-gray-500/50 rounded"
          />
        </Field>

        <Field label="End Date" invalid={!!errors.endDate} errorText={errors.endDate?.message}>
          <Datetime
            onChange={(date) => handleDateChange(date, "endDate")}
            inputProps={{
              placeholder: "Select end date and time",
              className: "w-full h-10 px-2 text-black dark:text-white transition-all duration-300 ",
            }}
            className="w-full focus:ring-2 border dark:border-gray-800  focus:ring-gray-500/50 rounded text-black"
          />
        </Field>

        <div className="flex items-center gap-2 justify-between w-full">
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md h-9 py-2 hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </Button>
        </div>
      </Stack>
    </form>
  );
};

export default EditPoll;
