import { ChangeEvent, useState } from "react";
import axios from "axios";

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }

    }

    async function handleFileUpload() {
        if (!file) return;
        setStatus('uploading');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post("https://httpbin.org/post", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total ?
                        Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                    setUploadProgress(progress);
                }
            });

            setStatus('success');
            setUploadProgress(100);

        } catch (error) {
            console.log(error)
            setStatus('error');
            setUploadProgress(0);
        }
    }

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {file && (
                <div>
                    <p>File name: {file.name}</p>
                    <p>File size: {file.size} bytes</p>
                    <p>File type: {file.type}</p>
                </div>
            )}
            {status === 'uploading' && (
                <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                            className="h-2.5 rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
                </div>
            )}
            {file && status !== 'uploading' && <button onClick={handleFileUpload}>Upload</button>}
            {status === 'success' && (
                <p className="text-sm text-green-600">File uploaded successfully!</p>
            )}

            {status === 'error' && (
                <p className="text-sm text-red-600">Upload failed. Please try again.</p>
            )}
        </div>

    );
}

export default FileUploader;