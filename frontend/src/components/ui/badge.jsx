import * as React from "react";
import {cn} from "@/lib/utils";
import {cva} from "class-variance-authority";


const badgeVariants = cva("inline-flex items-center rounded-md border font-semibold " +
    "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
                inactive: "border-transparent bg-primary text-primary-foreground shadow",
            },
            size: {
                default: "px-2 py-1 text-xs",
                sm: "px-2 py-1 text-sm",
                xl: "px-4 py-2 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);


const Badge = ({ className, variant, size, color, ...props }) => {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            style={{ background: color }}
            {...props}
        />
    );
};


export { Badge, badgeVariants };
