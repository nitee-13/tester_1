const API_BASE_URL = 'http://0.0.0.0:8000'; // adjust to your backend URL

export const analyzeContract = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze contract');
  }

  return await response.json();
};

export const getAnalysisStatus = async (jobId: string) => {
  const response = await fetch(`${API_BASE_URL}/status/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to get status');
  }
  return await response.json();
};

export const getAnalysisResult = async (jobId: string) => {
  const response = await fetch(`${API_BASE_URL}/result/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to get result');
  }
  return await response.json();
}; 