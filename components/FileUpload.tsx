// 'use client';

// import { useRef, useState } from 'react';
// import { Image, Video, ImageKitProvider, upload } from '@imagekit/next';
// import config from '@/lib/config';
// import { cn } from '@/lib/utils';
// import ImageIcon from 'next/image';
// import { toast } from 'sonner';

// const {
//     env: {
//         imagekit: { publicKey, urlEndpoint },
//     },
// } = config;

// const authenticator = async () => {
//     try {
//         const response = await fetch(
//             `${config.env.apiEndpoint}/api/auth/imagekit`
//         );

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(
//                 `Request failed with status ${response.status}: ${errorText}`
//             );
//         }

//         const data = await response.json();
//         const { signature, expire, token } = data;
//         return { token, expire, signature };
//     } catch (error) {
//         const message = error instanceof Error ? error.message : String(error);
//         throw new Error(`Authentication request failed: ${message}`);
//     }
// };

// interface Props {
//     type: 'image' | 'video';
//     accept: string;
//     placeholder: string;
//     folder: string;
//     variant: 'dark' | 'light';
//     onFileChange: (filePath: string) => void;
//     value?: string;
// }

// const FileUpload = ({
//     type,
//     accept,
//     placeholder,
//     folder,
//     variant,
//     onFileChange,
//     value,
// }: Props) => {
//     const fileInputRef = useRef<HTMLInputElement | null>(null);

//     // 🔄 CHANGED: split into two states
//     const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null); // local preview (before upload)
//     const [uploadedUrl, setUploadedUrl] = useState<string | null>(null); // final ImageKit URL after upload

//     const [progress, setProgress] = useState(0);

//     const styles = {
//         button:
//             variant === 'dark'
//                 ? 'bg-dark-300'
//                 : 'bg-light-600 border-gray-100 border',
//         placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
//         text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
//     };

//     const onError = (error: any) => {
//         console.error(error);
//         toast.error(`${type} upload failed`);
//     };

//     // 🔄 CHANGED: only set final URL from ImageKit
//     const onSuccess = (res: any) => {
//         setUploadedUrl(res.url); // ✅ use res.url, not res.filePath
//         onFileChange(res.url); // ✅ pass URL up
//         toast.success(`${type} uploaded successfully`);
//     };

//     const onValidate = (file: File) => {
//         if (type === 'image' && file.size > 20 * 1024 * 1024) {
//             toast.error('Image too large (max 20MB)');
//             return false;
//         } else if (type === 'video' && file.size > 50 * 1024 * 1024) {
//             toast.error('Video too large (max 50MB)');
//             return false;
//         }
//         return true;
//     };

//     const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const selectedFile = e.target.files?.[0];
//         if (!selectedFile) return;

//         if (!onValidate(selectedFile)) return;

//         // 🆕 ADDED: show local preview immediately
//         setPreviewUrl(URL.createObjectURL(selectedFile));
//         setUploadedUrl(null);
//         setProgress(0);

//         try {
//             const auth = await authenticator();
//             const res = await upload({
//                 file: selectedFile,
//                 fileName: selectedFile.name,
//                 folder,
//                 useUniqueFileName: true,
//                 ...auth,
//                 publicKey: publicKey,
//                 onProgress: ({ loaded, total }) => {
//                     const percent = Math.round((loaded / total) * 100);
//                     setProgress(percent);
//                 },
//             });

//             onSuccess(res);
//         } catch (err) {
//             onError(err);
//         }
//     };

//     // 🆕 ADDED: choose best available URL
//     const displayUrl = uploadedUrl || previewUrl;

//     return (
//         <ImageKitProvider urlEndpoint={urlEndpoint}>
//             <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept={accept}
//                 className="hidden"
//                 onChange={handleFileChange}
//             />

//             <button
//                 className={cn('upload-btn', styles.button)}
//                 onClick={(e) => {
//                     e.preventDefault();
//                     fileInputRef.current?.click();
//                 }}
//             >
//                 <ImageIcon
//                     src="/assets/icons/upload.svg"
//                     alt="upload-icon"
//                     width={20}
//                     height={20}
//                     className="object-contain"
//                 />

//                 <p className={cn('text-base', styles.placeholder)}>
//                     {placeholder}
//                 </p>

//                 {displayUrl && (
//                     <p className={cn('upload-filename', styles.text)}>
//                         {displayUrl.split('/').pop()}
//                     </p>
//                 )}
//             </button>

//             {progress > 0 && progress !== 100 && (
//                 <div className="w-full rounded-full bg-green-200">
//                     <div className="progress" style={{ width: `${progress}%` }}>
//                         {progress}%
//                     </div>
//                 </div>
//             )}

//             {/* 🔄 CHANGED: render only if displayUrl exists */}
//             {displayUrl &&
//                 (type === 'image' ? (
//                     <Image
//                         alt="preview"
//                         src={displayUrl}
//                         width={500}
//                         height={300}
//                     />
//                 ) : type === 'video' ? (
//                     <Video
//                         src={displayUrl}
//                         controls
//                         className="h-96 w-full rounded-xl"
//                     />
//                 ) : null)}
//         </ImageKitProvider>
//     );
// };

// export default FileUpload;

'use client';

import { useRef, useState } from 'react';
import { Image, Video, ImageKitProvider, upload } from '@imagekit/next';
import config from '@/lib/config';
// import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ImageIcon from 'next/image';
import { toast } from 'sonner';

const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(
            `${config.env.apiEndpoint}/api/auth/imagekit`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { token, expire, signature };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Authentication request failed: ${message}`);
    }
};

interface Props {
    type: 'image' | 'video';
    accept: string;
    placeholder: string;
    folder: string;
    variant: 'dark' | 'light';
    onFileChange: (filePath: string) => void;
    value?: string;
}

const FileUpload = ({
    type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value,
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });
    const [progress, setProgress] = useState(0);

    const styles = {
        button:
            variant === 'dark'
                ? 'bg-dark-300'
                : 'bg-light-600 border-gray-100 border',
        placeholder: variant === 'dark' ? 'text-light-100' : 'text-slate-500',
        text: variant === 'dark' ? 'text-light-100' : 'text-dark-400',
    };

    const onError = (error: any) => {
        console.error(error);
        // toast({
        //     title: `${type} upload failed`,
        //     description: `Your ${type} could not be uploaded. Please try again.`,
        //     variant: 'destructive',
        // });
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        // toast({
        //     title: `${type} uploaded successfully`,
        //     description: `${res.filePath} uploaded successfully!`,
        // });
    };

    const onValidate = (file: File) => {
        if (type === 'image' && file.size > 20 * 1024 * 1024) {
            // toast({
            //     title: 'File size too large',
            //     description:
            //         'Please upload a file that is less than 20MB in size',
            //     variant: 'destructive',
            // });
            // return false;
        } else if (type === 'video' && file.size > 50 * 1024 * 1024) {
            // toast({
            //     title: 'File size too large',
            //     description:
            //         'Please upload a file that is less than 50MB in size',
            //     variant: 'destructive',
            // });
            return false;
        }
        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!onValidate(selectedFile)) return;

        try {
            setProgress(0);

            const auth = await authenticator();
            const res = await upload({
                file: selectedFile,
                fileName: selectedFile.name,
                folder,
                useUniqueFileName: true,
                ...auth,
                publicKey: publicKey,
                onProgress: ({ loaded, total }) => {
                    const percent = Math.round((loaded / total) * 100);
                    setProgress(percent);
                },
            });

            onSuccess(res);
        } catch (err) {
            onError(err);
        }
    };

    return (
        <ImageKitProvider urlEndpoint={urlEndpoint}>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />

            <button
                className={cn('upload-btn', styles.button)}
                onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                }}
            >
                <ImageIcon
                    src="/assets/icons/upload.svg"
                    alt="upload-icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <p className={cn('text-base', styles.placeholder)}>
                    {placeholder}
                </p>

                {file?.filePath && (
                    <p className={cn('upload-filename', styles.text)}>
                        {file.filePath}
                    </p>
                )}
            </button>

            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {file?.filePath &&
                (type === 'image' ? (
                    <Image
                        alt={file.filePath}
                        src={file.filePath}
                        width={500}
                        height={300}
                    />
                ) : type === 'video' ? (
                    <Video
                        src={file.filePath}
                        controls
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)}
        </ImageKitProvider>
    );
};

export default FileUpload;
