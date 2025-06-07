import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import './styles.css';

const DependentInfo = ({ dependents = [] }) => {
  const [fileUrls, setFileUrls] = useState({}); // Store file URLs, names, and content types
  const [loadingFiles, setLoadingFiles] = useState({}); // Track loading state per file

  // Hàm gọi API lấy file minh chứng
  const fetchProofFile = async (fileId) => {
    try {
      setLoadingFiles((prev) => ({ ...prev, [fileId]: true }));
      const response = await axios.get(`/api/FileUpload/GetFile/${fileId}`, {
        responseType: 'blob', // Expect binary data
      });

      // Extract file name and content type from response headers
      const contentDisposition = response.headers['content-disposition'];
      // Extract file name from Content-Disposition or use a generic fallback
      let fileName = contentDisposition
        ? contentDisposition.match(/filename="(.+)"/)?.[1] || `file-${fileId}`
        : `file-${fileId}`;
      
      // Get content type from response headers, fallback to generic binary if missing
      const contentType = response.headers['content-type'] || 'application/octet-stream';

      // Ensure file name has an appropriate extension based on content type
      if (!fileName.match(/\.[a-zA-Z0-9]+$/)) {
        // Map common content types to extensions
        const extensionMap = {
          'application/pdf': '.pdf',
          'image/png': '.png',
          'image/jpeg': '.jpg',
          'image/gif': '.gif',
          'application/octet-stream': '', // No extension if unknown
        };
        const extension = extensionMap[contentType] || '';
        fileName += extension;
      }

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));

      return { url, fileName, contentType };
    } catch (error) {
      console.error(`Error fetching file ${fileId}:`, error);
      message.error('Không thể tải file minh chứng.');
      return null;
    } finally {
      setLoadingFiles((prev) => ({ ...prev, [fileId]: false }));
    }
  };

  // Fetch files for all dependents when component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      if (dependents && dependents.length > 0) {
        const filePromises = dependents.map(async (dep) => {
          if (dep.proofFile && dep.proofFile[0]?.fileId) {
            const result = await fetchProofFile(dep.proofFile[0].fileId);
            if (result) {
              setFileUrls((prev) => ({
                ...prev,
                [dep.proofFile[0].fileId]: {
                  url: result.url,
                  fileName: result.fileName,
                  contentType: result.contentType,
                },
              }));
              // No need to update proofFile[0].name since file name is not displayed
            }
          }
        });
        await Promise.all(filePromises);
      }
    };
    fetchFiles();

    // Cleanup URLs when component unmounts
    return () => {
      Object.values(fileUrls).forEach((file) => {
        if (file.url) window.URL.revokeObjectURL(file.url);
      });
    };
  }, [dependents]);

  // Handle file download
  const handleFileClick = (fileId) => {
    const file = fileUrls[fileId];
    if (file && file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.fileName; // Use the file name with correct extension
      link.click();
    } else {
      message.error('File không khả dụng.');
    }
  };

  const columns = [
    {
      title: 'Tình trạng đăng ký',
      dataIndex: 'registered',
      key: 'registered',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'taxCode',
      key: 'taxCode',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'N/A'),
    },
    {
      title: 'Mối quan hệ',
      dataIndex: 'relationship',
      key: 'relationship',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Hồ sơ minh chứng',
      dataIndex: 'proofFile',
      key: 'proofFile',
      render: (files, record) =>
        files && files.length > 0 ? (
          <Button
            className="download-btn"
            onClick={() => handleFileClick(files[0].fileId)}
            loading={loadingFiles[files[0].fileId]}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3m0 12l-4-4m4 4l4-4"></path>
                <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"></path>
              </svg>
            }
          />
        ) : (
          'N/A'
        ),
    },
  ];

  return (
    <div className="info-display">
      <Table
        columns={columns}
        dataSource={dependents.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        locale={{ emptyText: 'Không có người phụ thuộc' }}
        bordered
        className="custom-dependent-table"
      />
    </div>
  );
};

export default DependentInfo;