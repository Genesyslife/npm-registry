import React from "react";

import VideoPlayer from "@Genesys/video-player";

export default {
  title: "Video Player",
  component: VideoPlayer,
};

const Template = (args) => <VideoPlayer {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
