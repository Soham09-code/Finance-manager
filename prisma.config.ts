import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: {
    adapter: "javascript",
    family: "prisma",
    target: "prisma-client-js",
  },
});