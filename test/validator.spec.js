/* eslint-disable no-undef */
const emailValidator = require('../util/validators/email');

test('email 유효성 검증 - #1 equal', async () => {
    // given
    const email = 'test123@test.com';

    // when
    const result = emailValidator(email);

    // then
    expect(result).toBe(true);
});

test('email 유효성 검증 - #2 equal', async () => {
    // given
    const email = 'test123test.com';

    // when
    const result = emailValidator(email);

    // then
    expect(result).toBe(false);
});

test('email 유효성 검증 - #3 equal', async () => {
    // given
    const email = 'test.@test.test.com';

    // when
    const result = emailValidator(email);

    // then
    expect(result).toBe(false);
});
