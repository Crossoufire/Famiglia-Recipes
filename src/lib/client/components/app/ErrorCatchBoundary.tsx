import React from "react";
import {Skull} from "lucide-react";
import {ErrorComponent} from "~/lib/client/components/app/ErrorComponent";


export function ErrorCatchBoundary() {
    return (
        <ErrorComponent
            title={"Well, This is Awkward"}
            icon={<Skull className="w-10 h-10 animate-bounce"/>}
            footerText={"If this keeps happening, we probably broke something important."}
            text={"Sorry, it looks like something isn’t working right now. Please try refreshing the page or come back later."}
        />
    );
}
