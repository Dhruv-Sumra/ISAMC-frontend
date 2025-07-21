import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import adminService from '../../services/adminService';

const ExcelUploadModal = ({ isOpen, onClose, sectionName, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);

  // New state for manual entry fields (for pastEvents)
  const [manualFields, setManualFields] = useState({
    overview: '',
    highlights: '',
    theme: '',
    referenceLinks: '',
  });

  // Handler for manual input changes
  const handleManualFieldChange = (e) => {
    const { name, value } = e.target;
    setManualFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setIsUploading(true);
    setValidationErrors([]);
    setUploadedData(null);

    try {
      const data = await readExcelFile(file);
      const validatedData = adminService.validateExcelData(data, sectionName);
      
      if (validatedData.errors.length > 0) {
        setValidationErrors(validatedData.errors);
        toast.error(`Found ${validatedData.errors.length} validation errors. Please check the data.`);
      } else {
        setUploadedData(validatedData.data);
        toast.success(`Successfully parsed ${validatedData.data.length} records`);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Error reading the file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert to array of objects
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          const result = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              if (header && row[index] !== undefined) {
                obj[header] = row[index];
              }
            });
            return obj;
          });
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };


  const handleUploadToServer = async () => {
    if (!uploadedData || uploadedData.length === 0) {
      toast.error('No valid data to upload');
      return;
    }

    setIsUploading(true);

    try {
      // Debug: Check current authentication status
      const token = localStorage.getItem('accessToken');
      console.log('Current token exists:', !!token);
      console.log('Token valid:', adminService.hasValidToken());
      
      // Check token validity and refresh if needed
      if (!adminService.hasValidToken()) {
        console.log('Token expired or invalid, attempting refresh...');
        const refreshed = await adminService.refreshToken();
        if (!refreshed) {
          toast.error('Session expired. Please login again.');
          setIsUploading(false);
          return;
        }
        console.log('Token refreshed successfully');
      }

      // Use admin service for upload
      const result = await adminService.bulkUpload(sectionName, uploadedData);
      
      if (result.success) {
        toast.success(`Successfully uploaded ${uploadedData.length} items`);
        onUploadSuccess();
        onClose();
      } else {
        // Handle validation errors if present
        if (result.errors && Array.isArray(result.errors)) {
          setValidationErrors(result.errors);
          toast.error(`Upload failed with ${result.errors.length} validation errors. Please check the data.`);
        } else {
          toast.error(result.message || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle validation errors from service
      if (error.errors && Array.isArray(error.errors)) {
        setValidationErrors(error.errors);
        toast.error(`Upload failed with ${error.errors.length} validation errors. Please check the data.`);
      } else {
        toast.error(error.message || 'Upload failed. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = adminService.getTemplateData(sectionName);
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sectionName);
    XLSX.writeFile(wb, `${sectionName}_template.xlsx`);
  };

  // Add manual entry to uploadedData
  const handleAddManualEvent = () => {
    if (!manualFields.overview && !manualFields.highlights && !manualFields.theme && !manualFields.referenceLinks) {
      toast.error('Please fill at least one field to add an event.');
      return;
    }
    setUploadedData(prev => (prev ? [...prev, { ...manualFields }] : [{ ...manualFields }]));
    setManualFields({ overview: '', highlights: '', theme: '', referenceLinks: '' });
    toast.success('Event added to upload list.');
  };


  const resetForm = () => {
    setUploadedData(null);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-white/10 backdrop-blur-[8px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-file-excel text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Import {sectionName} from Excel
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Upload Excel file to import multiple items at once
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Download template for {sectionName}</p>
                <p className="text-xs text-gray-500">Ensure your Excel matches the required columns.</p>
              </div>
              <button onClick={downloadTemplate} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Download Template</button>
            </div>
          </div>

          {/* Manual Entry for Past Events */}
          {sectionName === 'pastEvents' && (
            <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
              <h3 className="font-bold text-lg mb-2">Add Past Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="overview"
                  value={manualFields.overview}
                  onChange={handleManualFieldChange}
                  placeholder="Overview"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="highlights"
                  value={manualFields.highlights}
                  onChange={handleManualFieldChange}
                  placeholder="Highlights"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="theme"
                  value={manualFields.theme}
                  onChange={handleManualFieldChange}
                  placeholder="Theme"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  name="referenceLinks"
                  value={manualFields.referenceLinks}
                  onChange={handleManualFieldChange}
                  placeholder="Reference Links (comma separated)"
                  className="p-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={handleAddManualEvent}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add Event
              </button>
            </div>
          )}

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <i className="fa-solid fa-upload text-gray-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Choose Excel file or drag it here
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Supports .xlsx, .xls, and .csv files
                </p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  'Select File'
                )}
              </button>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center space-x-2 mb-3">
                <i className="fa-solid fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Validation Errors ({validationErrors.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 dark:text-red-300">
                    <span className="font-medium">Row {error.row}:</span> {error.errors.join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Preview */}
          {uploadedData && uploadedData.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-3">
                <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400"></i>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Ready to Upload ({uploadedData.length} items)
                </h3>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                All data has been validated successfully. Click "Upload to Server" to proceed.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            {uploadedData && uploadedData.length > 0 && (
              <button
                onClick={handleUploadToServer}
                disabled={isUploading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isUploading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-upload mr-2"></i>
                    Upload to Server
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExcelUploadModal; 