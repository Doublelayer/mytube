module.exports = jest.mock("../../utils/logger", () => {
    return {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn()
    }
})
