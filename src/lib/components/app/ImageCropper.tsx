import Cropper from "react-easy-crop";
import {useTranslation} from "react-i18next";
import {Input} from "~/lib/components/ui/input";
import {Button} from "~/lib/components/ui/button";
import React, {useCallback, useState} from "react";
import {MutedText} from "~/lib/components/app/MutedText";


interface ImageCropperProps {
    aspect: number;
    fileName: string;
    resultClassName?: string;
    cropShape: "rect" | "round";
    onCropApplied: (file: File) => void;
}


interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}


interface CropState {
    zoom: number;
    open: boolean;
    imageSrc: string;
    showResult: boolean;
    croppedImage: Blob | null;
    crop: { x: number; y: number };
    croppedAreaPixels: CropArea | null;
}


export const ImageCropper = ({ onCropApplied, fileName, cropShape, aspect, resultClassName = "" }: ImageCropperProps) => {
    const { t } = useTranslation();
    const [state, setState] = useState<CropState>({
        zoom: 1,
        open: true,
        imageSrc: "",
        showResult: false,
        croppedImage: null,
        crop: { x: 0, y: 0 },
        croppedAreaPixels: null,
    });

    const getCroppedImg = async (imageSrc: string, crop: CropArea): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Could not get canvas context");
        }
        canvas.width = crop.width;

        canvas.height = crop.height;
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error("Canvas is empty"));
            }, "image/jpeg");
        });
    };

    const createImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", reject);
            image.src = url;
        });
    };

    const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const file = ev.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setState((prev) => ({
                ...prev,
                open: true,
                showResult: false,
                imageSrc: reader.result as string,
            }));
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: CropArea) => {
        setState((prev) => ({ ...prev, croppedAreaPixels }));
    }, []);

    const handleApplyCrop = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();

        if (!state.croppedAreaPixels || !state.imageSrc) return;

        const croppedImage = await getCroppedImg(state.imageSrc, state.croppedAreaPixels);
        const croppedFile = new File([croppedImage], `${fileName}.jpg`, { type: "image/jpeg" });
        onCropApplied(croppedFile);
        setState((prev) => ({ ...prev, open: false, showResult: true, croppedImage }));
    };

    const handleEditCrop = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();
        setState((prev) => ({ ...prev, open: true, showResult: false }));
    };

    return (
        <div>
            <Input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="file:text-muted-foreground cursor-pointer"
            />
            {(state.imageSrc && state.open) &&
                <div className="space-y-4 mt-6 bg-card rounded-lg p-3">
                    <div>
                        <div>{t("crop-title")}</div>
                        <MutedText className="not-italic">{t("crop-subtitle")}</MutedText>
                    </div>
                    <div className="relative h-[250px] w-full">
                        <Cropper
                            aspect={aspect}
                            zoom={state.zoom}
                            crop={state.crop}
                            cropShape={cropShape}
                            image={state.imageSrc}
                            onCropComplete={onCropComplete}
                            onCropChange={(crop) => setState((prev) => ({ ...prev, crop }))}
                            onZoomChange={(zoom) => setState((prev) => ({ ...prev, zoom }))}
                        />
                    </div>
                    <Button onClick={handleApplyCrop}>
                        {t("save")}
                    </Button>
                </div>
            }
            {state.showResult && state.croppedImage &&
                <div className="space-y-4 mt-4 bg-card rounded-lg p-3 h-min-[250px]">
                    <MutedText className="not-italic">{t("crop-selected")}</MutedText>
                    <img
                        alt={fileName}
                        className={resultClassName}
                        src={URL.createObjectURL(state.croppedImage)}
                    />
                    <Button onClick={handleEditCrop}>{t("edit")}</Button>
                </div>
            }
        </div>
    );
};
