const backendHost = "http://127.0.0.1:5000"
const apiPrefix = "/api/v1"
const apiURL = backendHost + apiPrefix
const githubPrefix = "/github"

// Функция для получения фолловеров пользователя
export const getUserFollowers = (username) => {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", `${apiURL}${githubPrefix}/${username}`, false); // Синхронный запрос
  xmlHttp.send(null);

  const response = JSON.parse(xmlHttp.responseText);

  // Проверка, если ответ содержит поле followers как массив
  if (response && Array.isArray(response.followers)) {
    return response.followers;  // Возвращаем массив фолловеров
  }

  // Если структура данных отличается, выводим ошибку
  console.error("Error: followers data is not an array", response);
  return [];
};
