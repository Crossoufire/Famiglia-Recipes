import {toast} from "sonner";
import type React from "react";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Input} from "~/lib/components/ui/input";
import {Label} from "~/lib/components/ui/label";
import {Button} from "~/lib/components/ui/button";
import {useUploadMutation} from "~/lib/react-query";
import {Textarea} from "~/lib/components/ui/textarea";
import {AlertCircle, FileText, Loader2, Upload} from "lucide-react";
import {RecipeFormValues} from "~/lib/server/utils/schemas";
import {Alert, AlertDescription} from "~/lib/components/ui/alert";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/lib/components/ui/tabs";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "~/lib/components/ui/dialog";


const MAX_TEXT_LENGTH = 10_000;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = {
    "image/png": [".png"],
    "image/webp": [".webp"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "image/jpeg": [".jpg", ".jpeg"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};


interface UploadDialogProps {
    form: ReturnType<typeof useForm<RecipeFormValues>>;
}


export default function UploadDialog({ form }: UploadDialogProps) {
    const { t } = useTranslation();
    const uploadMutation = useUploadMutation();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [textContent, setTextContent] = useState("");
    const [activeTab, setActiveTab] = useState("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const validateFile = (file: File) => {
        const errors: string[] = []

        if (file.size > MAX_FILE_SIZE) {
            errors.push(t("error-file-size"));
        }

        const fileType = file.type;
        const isValidType = Object.keys(ACCEPTED_FILE_TYPES).includes(fileType);

        if (!isValidType) {
            errors.push(t("error-file-type"));
        }

        return errors;
    }

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (file) {
            const fileErrors = validateFile(file);
            if (fileErrors.length > 0) {
                setErrors(fileErrors);
                setSelectedFile(null);
            }
            else {
                setErrors([]);
                setSelectedFile(file);
            }
        }
    }

    const handleTextChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = ev.target.value;
        if (text.length <= MAX_TEXT_LENGTH) {
            setTextContent(text);
            setErrors([]);
        }
        else {
            setErrors([t("error-text-length", { max: MAX_TEXT_LENGTH.toLocaleString() })]);
        }
    }

    const onOpenChange = (value: boolean) => {
        setOpen(value);
        if (!value) resetForm();
    }

    const handleSubmit = () => {
        const formData = new FormData();
        if (activeTab === "upload" && selectedFile) {
            formData.append("type", "file");
            formData.append("content", selectedFile);
        }
        else if (activeTab === "text" && textContent.trim()) {
            formData.append("type", "text");
            formData.append("content", textContent as string);
        }

        uploadMutation.mutate(formData, {
            onError: (error) => {
                setErrors([error.message]);
            },
            onSuccess: (data) => {
                setErrors([]);
                form.reset(data);
                setOpen(false);
                setTextContent("");
                setSelectedFile(null);
                toast.success(t("toast-success"));
            },
        })
    }

    const canSubmit = () => {
        if (activeTab === "upload") {
            return selectedFile && errors.length === 0;
        }
        else {
            return textContent.trim().length > 0 && errors.length === 0;
        }
    }

    const resetForm = () => {
        setErrors([]);
        setTextContent("");
        setSelectedFile(null);
        setActiveTab("upload");
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="h-4 w-4"/> {t("upload-button")}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[500px] space-y-3"
                onEscapeKeyDown={(ev) => uploadMutation.isPending && ev.preventDefault()}
                onPointerDownOutside={(ev) => uploadMutation.isPending && ev.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{t("upload-dialog-title")}</DialogTitle>
                    <DialogDescription>
                        {t("upload-dialog-desc")}
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-5">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <Upload className="h-4 w-4"/> {t("tab-file-upload")}
                        </TabsTrigger>
                        <TabsTrigger value="text" className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/> {t("tab-text-input")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">{t("label-choose-file")}</Label>
                            <Input
                                type="file"
                                id="file-upload"
                                onChange={handleFileChange}
                                disabled={uploadMutation.isPending}
                                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp"
                            />
                            <p className="text-sm text-muted-foreground">
                                {t("supported-formats")}
                            </p>
                            {selectedFile &&
                                <div className="text-sm text-green-600">
                                    {t("file-selected-with-size", {
                                        fileName: selectedFile.name,
                                        size: (selectedFile.size / 1024 / 1024).toFixed(2)
                                    })}
                                </div>
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="text-content">{t("label-text-content")}</Label>
                            <Textarea
                                id="text-content"
                                value={textContent}
                                onChange={handleTextChange}
                                disabled={uploadMutation.isPending}
                                placeholder={t("placeholder-text")}
                                className="min-h-[200px] max-h-[500px] overflow-y-auto"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{t("max-char-info")}</span>
                                <span className={textContent.length > MAX_TEXT_LENGTH ? "text-red-700" : ""}>
                                    {textContent.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                {errors.length > 0 &&
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-1">
                                {errors.map((error, idx) =>
                                    <li key={idx}>{error}</li>
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                }
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={uploadMutation.isPending}>
                        {t("cancel")}
                    </Button>
                    <Button onClick={handleSubmit} disabled={!canSubmit() || uploadMutation.isPending}>
                        {uploadMutation.isPending ?
                            <><Loader2 className="animate-spin"/> {t("uploading")}</>
                            :
                            t("upload")
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
