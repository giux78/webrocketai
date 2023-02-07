import { ChangeEvent, useRef, useState } from 'react';
import type { NextPage } from 'next'
import Layout2 from '../components/layout2';


const Train: NextPage = () => {
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    // 👇 We redirect the click event onto the hidden input element
    inputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    setFile(e.target.files[0]);

    // 🚩 do the file upload here normally...
  };

  return (
    <Layout2>
        <div>
        <div>Upload a file:</div>

        {/* 👇 Our custom button to select and upload a file */}
        <button onClick={handleUploadClick}>
            {file ? `${file.name}` : 'Click to select'}
        </button>

        {/* 👇 Notice the `display: hidden` on the input */}
        <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        </div>
    </Layout2>
  );
}

export default Train
