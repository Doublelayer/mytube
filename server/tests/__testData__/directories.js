const minimalCreateDirectoryPost = {
  rootPath: 'C:\\videos',
  filter: ['mp4'],
};

const minimalDirectory = {
  root: 'C:\\videos',
  filter: {
    extName: ['mp4'],
  },
  tree: {
    name: 'techslides',
    path: 'C:\\videos',
    relativePath: '.',
    type: 'directory',
    isSymbolicLink: false,
    stat: null,
    children: [
      {
        name: 'test-filename',
        path: 'C:\\videos',
        relativePath: 'test-filename',
        type: 'file',
        isSymbolicLink: false,
        stat: null,
        extension: 'mp4',
      },
    ],
    sizeInBytes: null,
  },
  inserted: ['C:\\videos\\test-file.mp4'],
};

module.exports = {
  minimalDirectory,
  minimalCreateDirectoryPost,
};
