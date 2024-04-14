import * as React from "react";
import {cn} from "@/lib/utils";
import {LuX} from "react-icons/lu";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Command as CommandPrimitive} from "cmdk";
import {Command, CommandEmpty, CommandGroup, CommandItem, CommandList,} from "@/components/ui/command";


const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

const transToGroupOption = (options, groupBy) => {
    if (options.length === 0) {
        return {};
    }

    if (!groupBy) {
        return { "": options };
    }

    const groupOption = {};

    options.forEach((option) => {
        const key = (option[groupBy]) || "";

        if (!groupOption[key]) {
            groupOption[key] = [];
        }

        groupOption[key].push(option);
    });

    return groupOption;
};

const removePickedOption = (groupOption, picked) => {
    const cloneOption = JSON.parse(JSON.stringify(groupOption));

    for (const [key, value] of Object.entries(cloneOption)) {
        cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
    }

    return cloneOption;
};


const MultipleSelector = React.forwardRef((props, ref) => {
    const { value, onChange, placeholder, defaultOptions: arrayDefaultOptions = [],
        options: arrayOptions, delay, onSearch, loadingIndicator, emptyIndicator, maxSelected = Number.MAX_SAFE_INTEGER,
        onMaxSelected, hidePlaceholderWhenSelected, disabled, groupBy, className, selectFirstItem = true,
        creatable = false, triggerSearchOnFocus = false, commandProps, inputProps } = props;

    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [selected, setSelected] = React.useState(value || []);
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);
    const [options, setOptions] = React.useState(transToGroupOption(arrayDefaultOptions, groupBy));

    React.useImperativeHandle(ref, () => ({
        selectedValue: [...selected],
        input: inputRef.current }), [selected]);

    const handleUnselect = React.useCallback((option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
    }, [selected]);

    const handleKeyDown = React.useCallback((ev) => {
        const input = inputRef.current;

        if (input) {
            if (ev.key === "Delete" || ev.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }

            if (ev.key === "Escape") {
                input.blur();
            }
        }
    }, [selected]);

    React.useEffect(() => {
        if (value) {
            setSelected(value);
        }
    }, [value]);

    React.useEffect(() => {
        // If <onSearch> provided, do not trigger options updated
        if (!arrayOptions || onSearch) {
            return;
        }
        const newOption = transToGroupOption(arrayOptions || [], groupBy);
        if (JSON.stringify(newOption) !== JSON.stringify(options)) {
            setOptions(newOption);
        }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    React.useEffect(() => {
        const doSearch = async () => {
            setIsLoading(true);
            const res = await onSearch?.(debouncedSearchTerm);
            setOptions(transToGroupOption(res || [], groupBy));
            setIsLoading(false);
        };

        const exec = async () => {
            if (!onSearch || !open) return;

            if (triggerSearchOnFocus) {
                await doSearch();
            }

            if (debouncedSearchTerm) {
                await doSearch();
            }
        };

        void exec();
    }, [debouncedSearchTerm, open]);

    const CreatableItem = () => {
        if (!creatable) {
            return undefined;
        }

        const Item = (
            <CommandItem
                value={inputValue}
                className="cursor-pointer"
                onMouseDown={(ev) => { ev.preventDefault(); ev.stopPropagation() }}
                onSelect={(value) => {
                    if (selected.length >= maxSelected) {
                        onMaxSelected?.(selected.length);
                        return;
                    }
                    setInputValue("");
                    const newOptions = [...selected, { value, label: value }];
                    setSelected(newOptions);
                    onChange?.(newOptions);
                }}
            >{`Create "${inputValue}"`}</CommandItem>
        );

        // For normal creatable
        if (!onSearch && inputValue.length > 0) {
            return Item;
        }

        // For async search creatable. avoid showing creatable item before loading first
        if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
            return Item;
        }

        return undefined;
    };

    const EmptyItem = React.useCallback(() => {
        if (!emptyIndicator) {
            return undefined;
        }

        // For async search that showing emptyIndicator
        if (onSearch && !creatable && Object.keys(options).length === 0) {
            return <CommandItem value="-" disabled>{emptyIndicator}</CommandItem>;
        }

        return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = React.useMemo(() => removePickedOption(options, selected), [options, selected]);

    // Avoid Creatable Selector freezing or lagging when paste a long string
    const commandFilter = React.useCallback(() => {
        if (commandProps?.filter) {
            return commandProps.filter;
        }

        if (creatable) {
            return (value, search) => {
                return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
            };
        }

        // Using default filter in `cmdk`
        return undefined;
    }, [creatable, commandProps?.filter]);

    return (
        <Command
            {...commandProps}
            onKeyDown={(ev) => { handleKeyDown(ev); commandProps?.onKeyDown?.(ev) }}
            className={cn("overflow-visible bg-transparent", commandProps?.className)}
            shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch}
            filter={commandFilter()}
        >
            <div className={cn("group rounded-md border border-input px-2 py-2 text-sm ring-offset-background " +
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", className)}>
                <div className="flex flex-wrap gap-2">
                    {selected.map((option) => {
                        return (
                            <Badge key={option.value} size="sm" variant="inactive" className="pr-0.5">
                                {option.label}
                                <Button variant="ghost" size="xs" className="ml-2 px-1" onClick={() => handleUnselect(option)}>
                                    <LuX className="h-4 w-4"/>
                                </Button>
                            </Badge>
                        );
                    })}

                    <CommandPrimitive.Input
                        {...inputProps}
                        ref={inputRef}
                        value={inputValue}
                        disabled={disabled}
                        onValueChange={(value) => {
                            setInputValue(value);
                            inputProps?.onValueChange?.(value);
                        }}
                        onBlur={(ev) => {
                            setOpen(false);
                            inputProps?.onBlur?.(ev);
                        }}
                        onFocus={(ev) => {
                            setOpen(true);
                            triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                            inputProps?.onFocus?.(ev);
                        }}
                        placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? "" : placeholder}
                        className={cn("ml-2 flex-1 bg-transparent h-8 outline-none placeholder:text-muted-foreground " +
                        "cursor-pointer", inputProps?.className)}
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open &&
                    <CommandList className="absolute top-0 z-10 w-full rounded-md border bg-popover
                    text-popover-foreground shadow-md outline-none animate-in">
                        {isLoading ?
                            <>{loadingIndicator}</>
                            :
                            <>
                                {EmptyItem()}
                                {CreatableItem()}
                                {!selectFirstItem && <CommandItem value="-" className="hidden"/>}
                                {Object.entries(selectables).map(([key, dropdowns]) => (
                                    <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                                        <>
                                            {dropdowns.map((option) => {
                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        value={option.value}
                                                        disabled={option.disable}
                                                        onMouseDown={(ev) => {
                                                            ev.preventDefault();
                                                            ev.stopPropagation();
                                                        }}
                                                        onSelect={() => {
                                                            if (selected.length >= maxSelected) {
                                                                onMaxSelected?.(selected.length);
                                                                return;
                                                            }
                                                            setInputValue("");
                                                            const newOptions = [...selected, option];
                                                            setSelected(newOptions);
                                                            onChange?.(newOptions);
                                                        }}
                                                        className={cn("cursor-pointer", option.disable &&
                                                        "cursor-default text-muted-foreground")}
                                                    >
                                                        {option.label}
                                                    </CommandItem>
                                                );
                                            })}
                                        </>
                                    </CommandGroup>
                                ))}
                            </>
                        }
                    </CommandList>
                }
            </div>
        </Command>
    );
});
MultipleSelector.displayName = "MultipleSelector";


export default MultipleSelector;
