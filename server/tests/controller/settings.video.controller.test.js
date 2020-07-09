const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);
const db = require('../../database');
const Video = require('../../model/video.model');
const { Settings, DirectoryTree } = require('../../model/settings.model');

const videos = require('../__testData__/videos');
const { minimalDirectory } = require('../__testData__/directories');
require('../__mocks__/loggerMock');

const urlPrefix = '/api/v1/settings/video';

beforeAll(async () => {
  await db.connect(() => {});
});

afterEach(async () => {
  await Video.deleteMany();
  await DirectoryTree.deleteMany();
});

describe('Settings Controller', () => {
  describe('GET | listDirectories ', () => {
    it('when no directories are available, enpoint should return empty array', async (done) => {
      const res = await request.get(`${urlPrefix}/list-directories`);

      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual([]);

      done();
    });

    it('when directories are available, enpoint should return directory trees', async (done) => {
      const tree = new DirectoryTree(minimalDirectory);
      await tree.save();

      await request.get(`${urlPrefix}/list-directories`).expect('Content-Type', /json/);
      done();
    });
  });
});
