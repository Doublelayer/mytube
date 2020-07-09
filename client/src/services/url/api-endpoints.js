export const API_ROOT = 'http://localhost:5005';

const API_VERSION = 'api/v1';
const API_URL = `${API_ROOT}/${API_VERSION}`;

const VIDEO_SETTINGS = `${API_URL}/settings/video`;

export const STORED_DIRECTORIES = `${VIDEO_SETTINGS}/list-directories`;
export const DIRECTORY_TREE = `${VIDEO_SETTINGS}/create-tree-or-update`;
export const REFRESH_TREE = `${VIDEO_SETTINGS}/refresh-tree`;
export const UPDATE_DATABASE = `${VIDEO_SETTINGS}/build`;

export const LIST_VIDEO = `${API_URL}/video/list`;
export const FIND_VIDEO = `${API_URL}/video/find`;
export const COUNT_VIDEO = `${API_URL}/video/update-view-count`;
export const THUMB_VIDEO = `${API_URL}/video/thumbnail`;
export const STREAM_VIDEO = `${API_URL}/video/stream`;
export const FIND_BY = `${API_URL}/video/findBy`;
