import className from "classnames";
import { GoSync } from "react-icons/go";

import { ReactNode } from "react";

function Button({
  children,
  loading,
  ...rest
}: {
  children: ReactNode;
  loading: boolean;
  [key: string]: any;
}) {
  const classes = className(
    rest.className,
    "px-5 py-2 border border-white rounded-full text-white text-md transition-shadow bg-transparent duration-300 hover:shadow-[0_0_0_3px_#fff]"
  );

  return (
    <button {...rest} disabled={loading} className={classes}>
      {loading ? <GoSync className="animate-spin" /> : children}
    </button>
  );
}

export default Button;
