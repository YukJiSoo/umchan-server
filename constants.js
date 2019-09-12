function define(name, value) {
    Object.defineProperty(exports, name, {
        value,
        enumerable: true,
    });
}

define('ERR_MESSAGE', {
    EMAIL_FORMAT: '잘못된 email 형식입니다',
    PASSWORD_LENGTH: '8자 이상 16자 이하로 입력해주세요',
    PASSWORD_ALPHA: '영문을 최소 1자이상 포함해주세요',
    PASSWORD_NUMBER: '숫자를 최소 1자 이상 포함해주세요',
    PASSWORD_SPECIAL_CHAR: '특수문자를 최소 1자 이상 포함해주세요',
});
