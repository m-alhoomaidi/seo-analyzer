import type { TagStatus } from "@/types/seo";

// Check if a URL is valid
export const isValidUrl = (url: string): boolean => {
  try {
    // Try to construct a URL object
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch (error) {
    return false;
  }
};

// Prefix URL with https:// if not present
export const prefixUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

// Helper to get a color class based on status
export const getStatusColorClass = (status: TagStatus): string => {
  switch (status) {
    case 'present':
      return 'text-success';
    case 'missing':
      return 'text-error';
    case 'needs_improvement':
      return 'text-warning';
    default:
      return 'text-gray-500';
  }
};

// Helper to get a badge color class based on status
export const getBadgeColorClass = (status: TagStatus): string => {
  switch (status) {
    case 'present':
      return 'bg-success';
    case 'missing':
      return 'bg-error';
    case 'needs_improvement':
      return 'bg-warning';
    default:
      return 'bg-gray-500';
  }
};

// Helper to get a status icon based on status
export const getStatusIcon = (status: TagStatus): string => {
  switch (status) {
    case 'present':
      return '✓';
    case 'missing':
      return '✗';
    case 'needs_improvement':
      return '⚠';
    default:
      return '';
  }
};

// Truncate a string to a maximum length
export const truncateString = (str: string, maxLength: number): string => {
  if (!str) return '';
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

// Extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch (error) {
    return url;
  }
};

// Helper function to count characters
export const countCharacters = (str: string): number => {
  return str ? str.length : 0;
};

// Check title tag length
export const checkTitleLength = (title: string | undefined): {
  status: TagStatus;
  message: string;
} => {
  if (!title) {
    return { status: 'missing', message: 'Title tag is missing' };
  }
  
  const length = title.length;
  
  if (length < 30) {
    return { 
      status: 'needs_improvement', 
      message: `Title is too short (${length} characters). Aim for 50-60 characters.` 
    };
  }
  
  if (length > 60) {
    return { 
      status: 'needs_improvement', 
      message: `Title is too long (${length} characters). Aim for 50-60 characters.` 
    };
  }
  
  return { 
    status: 'present', 
    message: `Good length (${length} characters). Recommended length is 50-60 characters.` 
  };
};

// Check description tag length
export const checkDescriptionLength = (description: string | undefined): {
  status: TagStatus;
  message: string;
} => {
  if (!description) {
    return { status: 'missing', message: 'Meta description is missing' };
  }
  
  const length = description.length;
  
  if (length < 120) {
    return { 
      status: 'needs_improvement', 
      message: `Description is too short (${length} characters). Aim for 150-160 characters.` 
    };
  }
  
  if (length > 160) {
    return { 
      status: 'needs_improvement', 
      message: `Description is too long (${length} characters). Aim for 150-160 characters.` 
    };
  }
  
  return { 
    status: 'present', 
    message: `Good length (${length} characters). Recommended length is 150-160 characters.` 
  };
};
