import React from "react";

import AudioPlayer from "@Genesys/audio-player";

export default {
  title: "Audio Player",
  component: AudioPlayer,
};

const Template = (args) => <AudioPlayer {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
