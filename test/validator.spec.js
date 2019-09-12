/* eslint-disable no-undef */
const validator = require('../util/validators');
const { ERR_MESSAGE } = require('../constants');

test('email 유효성 검증 - #1 equal', async () => {
    // given
    const email = 'test123@test.com';

    // when
    const result = validator.email(email);

    // then
    expect(result.success).toBe(true);
});

test('email 유효성 검증 - #2 equal', async () => {
    // given
    const email = 'test123test.com';

    // when
    const result = validator.email(email);

    // then
    expect(result.success).toBe(false);
});

test('email 유효성 검증 - #3 equal', async () => {
    // given
    const email = 'test.@test.test.com';

    // when
    const result = validator.email(email);

    // then
    expect(result.success).toBe(false);
});


test('password 유효성 검증 - #1 success', async () => {
    // given
    const password = 'test123!@#';

    // when
    const result = validator.password(password);

    // then
    expect(result.success).toBe(true);
});

test('password 유효성 검증 - #2 fail 길이제한', async () => {
    // given
    const password = 'test';

    // when
    const result = validator.password(password);

    // then
    expect(result.message).toBe(ERR_MESSAGE.PASSWORD_LENGTH);
});

test('password 유효성 검증 - #3 fail 영문 최소 1개 포함', async () => {
    // given
    const password = '12345678!@';

    // when
    const result = validator.password(password);

    // then
    expect(result.message).toBe(ERR_MESSAGE.PASSWORD_ALPHA);
});

test('password 유효성 검증 - #4 fail 숫자 최소 1개 포함', async () => {
    // given
    const password = 'testqwer!@';

    // when
    const result = validator.password(password);

    // then
    expect(result.message).toBe(ERR_MESSAGE.PASSWORD_NUMBER);
});

test('password 유효성 검증 - #5 fail 특수문자 최소 1개 포함', async () => {
    // given
    const password = 'test123456';

    // when
    const result = validator.password(password);

    // then
    expect(result.message).toBe(ERR_MESSAGE.PASSWORD_SPECIAL_CHAR);
});

test('name 유효성 검증 - #1 success ', async () => {
    // given
    const name = '테스트';

    // when
    const result = validator.name(name);

    // then
    expect(result.success).toBe(true);
});

test('name 유효성 검증 - #2 fail 영어 이름은 성이랑 이름사이 띄어쓰기 ', async () => {
    // given
    const name = 'TestTT';

    // when
    const result = validator.name(name);

    // then
    expect(result.message).toBe(ERR_MESSAGE.NAME_FORMAT);
});

test('name 유효성 검증 - #3 success 영어 이름은 성이랑 이름사이 띄어쓰기 ', async () => {
    // given
    const name = 'Test TT';

    // when
    const result = validator.name(name);

    // then
    expect(result.success).toBe(true);
});

test('name 유효성 검증 - #4 fail 한글 이름은 2자이상 17자 이하', async () => {
    // given
    const name = '김';

    // when
    const result = validator.name(name);

    // then
    expect(result.message).toBe(ERR_MESSAGE.NAME_FORMAT);
});

test('name 유효성 검증 - #4 fail 한글 이름은 2자이상 17자 이하', async () => {
    // given
    const name = '박하늘별님구름햇님보다사랑스러우리';

    // when
    const result = validator.name(name);

    // then
    expect(result.success).toBe(true);
});
