import Cropper from "react-easy-crop";
import {useCallback, useState} from "react";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {MutedText} from "@/components/app/MutedText";


export const ImageCropper = ({ onCropApplied, fileName, cropShape, aspect, resultClassName = "" }) => {
    const { t } = useTranslation();
    const [state, setState] = useState({
        zoom: 1,
        open: true,
        imageSrc: "",
        croppedImage: "",
        showResult: false,
        crop: { x: 0, y: 0 },
        croppedAreaPixels: null,
    });

    const getCroppedImg = async (imageSrc, crop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = crop.width;

        canvas.height = crop.height;
        // noinspection JSCheckFunctionSignatures
        ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(new Error("Canvas is empty"));
            }, "image/jpeg");
        });

    };

    const createImage = (url) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", reject);
            image.src = url;
        });
    };

    const onFileChange = (ev) => {
        const file = ev.target.files[0];
        if (file) {
            const reader = new FileReader();
            // noinspection JSCheckFunctionSignatures
            reader.onload = () => setState((prev) => ({
                ...prev,
                open: true,
                showResult: false,
                imageSrc: reader.result,
            }));
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        // noinspection JSCheckFunctionSignatures
        setState((prev) => ({ ...prev, croppedAreaPixels }));
    }, []);

    const handleApplyCrop = async (ev) => {
        ev.preventDefault();

        const croppedImage = await getCroppedImg(state.imageSrc, state.croppedAreaPixels);
        // noinspection JSCheckFunctionSignatures
        const croppedFile = new File([croppedImage], `${fileName}.jpg`, { type: "image/jpeg" });
        onCropApplied(croppedFile);
        // noinspection JSCheckFunctionSignatures
        setState((prev) => ({ ...prev, open: false, showResult: true, croppedImage }));
    };

    const handleEditCrop = (ev) => {
        ev.preventDefault();
        // noinspection JSCheckFunctionSignatures
        setState((prev) => ({ ...prev, open: true, showResult: false }));
    };

    // noinspection JSCheckFunctionSignatures
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
                    <Button onClick={handleApplyCrop}>{t("save")}</Button>
                </div>
            }
            {state.showResult &&
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
