const API_BASE_URL = 'http://0.0.0.0:8000';

const HIGHLIGHT_API_URL = 'http://127.0.0.1:8001'// adjust to your backend URL

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

export const highlightPdfClauses = async(file: File, sentences: string[]) => { 
  const formData = new FormData();
  formData.append('file', file);
  sentences.forEach(sentence => {
    formData.append('sentences', sentence);
  });

  const response = await fetch(`${HIGHLIGHT_API_URL}/highlight-pdf/`, {
    method: 'POST',
    body: formData,
  });
  if(!response.ok) { 
    throw new Error('Failed to highlight pdf clauses');
  }
  return await response.blob();

}