import "module-alias/register";
import { addAliases } from "module-alias";
import path from "path";

const baseDir = path.join(__dirname, "lib");
addAliases({
  "@adapters": path.join(baseDir, "adapters"),
  "@commands": path.join(baseDir, "commands"),
  "@factories": path.join(baseDir, "factories"),
  "@services": path.join(baseDir, "services"),
  "@templates": path.join(baseDir, "templates"),
  "@apiTypes": path.join(baseDir, "types"),
  "@utils": path.join(baseDir, "utils"),
  "@src": __dirname,
});
