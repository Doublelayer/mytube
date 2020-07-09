const app = require("../../app");
const supertest = require("supertest");
const request = supertest(app);
const db = require('../../database');
const Video = require('../../model/video.model');

const videos = require("../__testData__/videos")
require("../__mocks__/loggerMock")

const urlPrefix = "/api/v1/video";

beforeAll(async () => {
    await db.connect(() => { })
});

afterEach(async () => {
    await Video.deleteMany();
});

describe('Video Controller', () => {
    describe('GET | find video by id ', () => {

        it('when video with given id is not present in database, then http status 404 and msg "not found" should returned', async done => {
            const res = await request.get(`${urlPrefix}/find/123`);

            expect(res.status).toBe(404);
            expect(res.body.msg).toBe("not found")
            done()
        })

        it('when video with given id is present in database, then the video should return', async done => {
            for (const u of videos) {
                const video = new Video(u);
                const newVideo = await video.save();
                const res = await request.get(`${urlPrefix}/find/${newVideo._id}`);

                expect(res.status).toBe(200);
                expect(newVideo._id.equals(res.body._id)).toBe(true)
            }
            done()
        })

        it('when given id contains special chars, then https status 404 should returned', async done => {
            const stringId = "stringId"
            const res = await request.get(`${urlPrefix}/find/${stringId}`);

            expect(res.status).toBe(404)
            done()
        })
    })

    describe('GET | update video count by video id', () => {

        it('when video by given id is found in database, http status 204 should returned and video count should increment by 1', async done => {
            // store new video
            const video = new Video(videos[0]);
            const newVideo = await video.save();

            // update viewCount
            const res_1 = await request.get(`${urlPrefix}/update-view-count?id=${newVideo._id}`);
            expect(res_1.status).toBe(204)

            // get video from db
            const res_2 = await request.get(`${urlPrefix}/find/${newVideo._id}`);
            expect(res_2.body.statistics.viewCount).toBe(1);

            done()
        })

        it('when video by given id is not found in database, should return http status 400', async done => {
            const res = await request.get(`${urlPrefix}/update-view-count?id=123`);

            expect(res.status).toBe(400)
            done()
        })

        it('when given id contains special chars and video is not found in database, http status 400 should returned', async done => {
            const res = await request.get(`${urlPrefix}/update-view-count?id=-1-#2/%3`);

            expect(res.status).toBe(400)
            done()
        })

        it('when no id param is provided, should return http status 400', async done => {
            const res = await request.get(`${urlPrefix}/update-view-count`);

            expect(res.status).toBe(400)
            done()
        })
    })

    describe('POST | list videos by "nextpage", "limit" and "projection"', () => {

        it('when 20 entries available in database and post body request 5 entries from page one, should return expected result', async done => {
            // save 20 new videos to db
            await storeMultipleVideosToDB()

            const res = await request.post(`${urlPrefix}/list`).send({
                nextPage: 1,
                limit: 5,
                projection: ""
            });

            expect(res.status).toBe(200)
            done();
        })
    })

    const storeMultipleVideosToDB = async () => {
        for (i = 0; i < 20; i++) {
            const video = new Video(videos[0]);
            await video.save();
        }

    }
})