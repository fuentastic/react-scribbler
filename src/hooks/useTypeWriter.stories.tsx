import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import { useTypeWriter, TypeWriterOptions } from "./useTypeWriter";

// Mock component to demonstrate the useTypeWriter hook
const TypeWriterDemo: React.FC<{ options: TypeWriterOptions }> = ({
  options,
}) => {
  const messages = ["Hello, world!", "Welcome to Storybook!"];
  const text = useTypeWriter(messages, options);

  return <div>{text}</div>;
};

const meta: Meta<typeof TypeWriterDemo> = {
  component: TypeWriterDemo,
  title: "useTypeWriter",
  argTypes: {
    baseTypeSpeed: {
      control: "number",
      description: "The base speed at which characters are typed",
    },
    baseBackspaceSpeed: {
      control: "number",
      description: "The base speed at which characters are deleted",
    },
    pauseDelay: {
      control: "number",
      description: "The delay between typing and backspacing",
    },
    errorChance: {
      control: "number",
      description: "The chance of typing error (not implemented in hook)",
    },
  },
};
export default meta;
type Story = StoryObj<typeof TypeWriterDemo>;

export const Primary: Story = {
  args: {
    options: {
      baseTypeSpeed: 120,
      baseBackspaceSpeed: 100,
      pauseDelay: 1000,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const { options } = args;

    // Initial state: empty text
    expect(canvas.queryByText("")).toBeTruthy();

    // Typing state: Text should match the first message partially
    await new Promise((r) => setTimeout(r, options.baseTypeSpeed * 5));
    expect(canvas.queryByText(/^Hello,/)).toBeTruthy();

    // Full message state: Entire first message is typed out
    await new Promise((r) =>
      setTimeout(r, options.baseTypeSpeed * messages[0].length)
    );
    expect(canvas.getByText("Hello, world!")).toBeTruthy();

    // Backspacing state: Text should be partially deleted
    await new Promise((r) => setTimeout(r, options.baseBackspaceSpeed * 5));
    expect(canvas.queryByText(/^Hello,/)).toBeTruthy();

    // Paused state: No changes in text for the duration of pauseDelay
    const prevText = canvas.getByText().textContent;
    await new Promise((r) => setTimeout(r, options.pauseDelay));
    expect(canvas.getByText(prevText)).toBeTruthy();
  },
};

export const FastTyping: Story = {
  args: {
    options: {
      baseTypeSpeed: 50,
      baseBackspaceSpeed: 40,
      pauseDelay: 500,
    },
  },
  // Implement play function similar to the Primary story but with adjusted timings
};

export const SlowTyping: Story = {
  args: {
    options: {
      baseTypeSpeed: 300,
      baseBackspaceSpeed: 250,
      pauseDelay: 1500,
    },
  },
  // Implement play function similar to the Primary story but with adjusted timings
};

export const CustomMessage: Story = {
  args: {
    options: {
      messages: ["Custom storybook message!"],
      baseTypeSpeed: 100,
      baseBackspaceSpeed: 80,
      pauseDelay: 800,
    },
  },
  // Implement play function to validate custom message
};
