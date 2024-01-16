import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  useHumanWriter,
  HumanWriterOptions,
} from "../src/hooks/useHumanWriter"; // Adjust the import path as needed

// The component that uses the custom hook
const TypingDemo: React.FC<{
  messages: string[];
  options: HumanWriterOptions;
}> = ({ messages, options }) => {
  const typedMessage = useHumanWriter(messages, options);
  return <div data-testid="typing-demo">{typedMessage}</div>;
};

const meta: Meta<typeof TypingDemo> = {
  title: "useHumanWriter",
  component: TypingDemo,
  argTypes: {
    messages: {
      control: "array",
      description: "Array of messages for the human writer to type",
    },
    options: {
      control: "object",
      description: "Configuration options for the typing behavior",
      defaultValue: {
        baseTypeSpeed: 120,
        baseBackspaceSpeed: 100,
        pauseDelay: 1000,
        errorChance: 0.05,
      },
      table: {
        type: {
          summary: "HumanWriterOptions",
          detail: `baseTypeSpeed: number; baseBackspaceSpeed: number; pauseDelay: number; errorChance: number;`,
        },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof TypingDemo>;

export const Primary: Story = {
  args: {
    messages: ["Hello World!", "This is a typing demo."],
    options: {
      baseTypeSpeed: 120,
      baseBackspaceSpeed: 100,
      pauseDelay: 1000,
      errorChance: 0.05,
    },
  },
};

// Rest of your stories...

export const TypingEffect: Story = {
  args: {
    messages: ["Hello, watch me type!"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the first message to start typing
    await expect(
      canvas.findByText(/Hello, watch me type!/gi)
    ).resolves.toBeTruthy();

    // Ensure the component goes through the typing process
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for a few seconds

    // Check if the message has been typed
    expect(canvas.getByTestId("typing-demo").textContent).toBe(
      "Hello, watch me type!"
    );

    // You can add more checks here for specific behavior like backspacing, typing speed, etc.
  },
};

export const WithErrorTyping: Story = {
  args: {
    messages: ["Error-prone typing ahead!"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the message to start typing
    await expect(
      canvas.findByText(/Error-prone typing ahead!/gi)
    ).resolves.toBeTruthy();

    // Check for the presence of a typing error after a certain time
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for enough time for an error to occur

    // Check if the error has been corrected, you might need to adjust the timing and errorChance to see this
    expect(canvas.getByTestId("typing-demo").textContent).toBe(
      "Error-prone typing ahead!"
    );
  },
};
