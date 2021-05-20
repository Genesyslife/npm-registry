import React from "react";

import AudioVisualizer from "@Genesys/audio-visualizer";

export default {
  title: "Audio Visualizer",
  component: AudioVisualizer,
};

const Template = (args) => <AudioVisualizer {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
