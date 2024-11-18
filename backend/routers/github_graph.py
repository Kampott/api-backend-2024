import requests
from fastapi import APIRouter
from backend.config import settings

github_router = APIRouter(prefix='/github', tags=['Github'])

# Функция для получения фолловеров
def get_followers(username: str, token: str = None):
    headers = {"authorization": f"token {token}"} if token else {}
    url = f"https://api.github.com/users/{username}/followers"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return []

# Получаем размер пользователя (основываясь на количестве подписчиков)
def calculate_size(username: str, token: str = None):
    url = f"https://api.github.com/users/{username}"
    headers = {"authorization": f"token {token}"} if token else {}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        user_data = response.json()
        follower_count = user_data.get('followers', 0)
        # Примерный расчет: размер = базовый размер + количество фолловеров * коэффициент
        return 50 + (follower_count * 0.5)
    return 50  # если ошибка, ставим дефолтный размер

@github_router.get("/{username}")
async def root(username: str = "x4nth055"):
    token = settings.GITHUB_API_TOKEN
    followers = get_followers(username, token)

    # Для каждого фолловера запрашиваем его фолловеров рекурсивно
    def get_follower_data(follower):
        follower_data = follower
        follower_data['followers'] = get_followers(follower['login'], token)
        # Расчитываем size для каждого фолловера
        follower_data["size"] = calculate_size(follower['login'], token)
        return follower_data

    followers_with_followers = [get_follower_data(f) for f in followers]

    # Для каждого фолловера добавляем данные о размере и аватарке
    for f in followers_with_followers:
        f["avatar_url"] = f.get("avatar_url", "https://default-avatar.com")

    # Возвращаем данные о пользователе и его фолловерах
    return {"login": username, "followers": followers_with_followers}


@github_router.get("/{username}/repos")
async def get_repos(username: str):
    token = settings.GITHUB_API_TOKEN
    url = f"https://api.github.com/users/{username}/repos"
    headers = {"authorization": f"token {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Could not fetch repositories"}


@github_router.post("/{username}/follow")
async def follow_user(username: str, follower: str):
    # Пример создания "подписки" на пользователя
    return {"message": f"User {follower} followed {username}"}
