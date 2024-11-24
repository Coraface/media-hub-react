import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const useGetQueryParam = (
  param: string,
  isPath: boolean = false
): string => {
  const location = useLocation();

  return useMemo(() => {
    if (isPath) {
      // Extract value from the path, assuming format like /profile/username
      const pathSegments = location.pathname.split("/").filter(Boolean); // Split and remove empty parts
      const paramIndex = pathSegments.indexOf(param);
      if (paramIndex !== -1 && paramIndex + 1 < pathSegments.length) {
        return pathSegments[paramIndex + 1];
      }
      throw new Error(`Value for "${param}" not found in the path.`);
    } else {
      // Extract value from query params
      const urlParams = new URLSearchParams(location.search);
      const parameter = urlParams.get(param);
      if (!parameter) {
        throw new Error(`Query parameter "${param}" not found.`);
      }
      return parameter;
    }
  }, [location, param, isPath]);
};
