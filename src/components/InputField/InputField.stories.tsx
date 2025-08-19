import { useState } from "react";
import { InputField } from "./InputField";
import type { InputFieldProps } from "./InputField";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<InputFieldProps> = {
  title: "Components/InputField",
  component: InputField,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<InputFieldProps>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <InputField {...args} value={value} onChange={e => setValue(e.target.value)} />;
  },
  args: {
    label: "Name",
    placeholder: "Enter your name",
    helperText: "This is a helper text.",
    variant: "outlined",
    size: "md",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    errorMessage: "Invalid email address.",
    invalid: true,
    variant: "filled",
    size: "md",
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    placeholder: "Disabled input",
    disabled: true,
    variant: "ghost",
    size: "md",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <InputField label="Small" size="sm" placeholder="Small" />
      <InputField label="Medium" size="md" placeholder="Medium" />
      <InputField label="Large" size="lg" placeholder="Large" />
    </div>
  ),
};
