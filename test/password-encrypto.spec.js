/* eslint-disable no-undef */
const encrypto = require('../util/password-encrypto');

test('password-encrypto key 생성 success', async () => {
    // given
    const password = 'test123!@#';

    try {
        // when
        const { passwordKey, salt } = await encrypto(password);

        // then
        expect(passwordKey).not.toBe(undefined);
        expect(salt).not.toBe(undefined);
    } catch (error) {
        // then
        console.log(error);
    }
});
