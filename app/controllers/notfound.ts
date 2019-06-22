import { NotFoundError } from "../errors";

// 404 Handler
const notfound = (): void => {
  throw new NotFoundError("Route Not Found");
};

export default notfound;
