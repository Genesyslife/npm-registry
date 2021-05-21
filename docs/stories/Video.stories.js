import React from "react";

import Video from "@Genesys/video";

export default {
  title: "Video",
  component: Video,
};

const Template = (args) => <Video {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
