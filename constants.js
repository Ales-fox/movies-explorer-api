const errorMessage = {
  notFoundUser: 'Запрашиваемый пользователь не найден',
  notFoundMovie: 'Запрашиваемый фильм не найден',
  castError: 'Некорректный id',
  validationError: 'Ошибка валидации',
  jwtError: 'Отсутствие токена/некорректный токен',
  emailExistError: 'Указан email, который уже существует на сервере',
  resourseExistError: 'Запрашиваемый ресурс не найден',
  forbiddenError: 'Доступ к запрошеному ресурсу запрещен',
  errorAuth: 'Неправильная почта или пароль',
  errorAuth2: 'Ошибка авторизации',
  serverError: 'На сервере произошла ошибка',
};
const SECRET_JWT_DEV = 'some-secret-key';
const linkPatternValidation = /(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.[\w-]{1,32}))(:\d{2,5})?((\/.+)+)?\/?#?/;
const allowedCors = [
  'http://movies.nomoredomains.club',
  'https://movies.nomoredomains.club',
  'http://localhost:3001',
  'https://localhost:3001',
];

module.exports = {
  errorMessage,
  SECRET_JWT_DEV,
  linkPatternValidation,
  allowedCors,
};
