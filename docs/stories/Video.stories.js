import React from "react";

import Video from "@Genesys/video";

export default {
  title: "Video",
  component: Video,
};

const Template = (args) => (
  <Video
    src="https://guigallo.s3-sa-east-1.amazonaws.com/PINDORAMA_LEGENDA+INGLES.mp4"
    sizes={[16, 9]}
    {...args}
  />
);

export const Basic = Template.bind({});
Basic.args = {};
