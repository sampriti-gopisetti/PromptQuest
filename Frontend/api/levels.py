from typing import Optional, Dict, Any, List

_LEVELS: Dict[str, Dict[str, Any]] = {
    "roman_empire_facts": {
        "id": "roman_empire_facts",
        "title": "Give me five facts about the Roman Empire.",
        "quest_scenario": "Give me five facts about the Roman Empire.",
    },
    "supply_and_demand": {
        "id": "supply_and_demand",
        "title": "Explain the concept of supply and demand.",
        "quest_scenario": "Explain the concept of supply and demand.",
    },
    "energy_saving_three": {
        "id": "energy_saving_three",
        "title": "What are three ways to save energy at home?",
        "quest_scenario": "What are three ways to save energy at home?",
    },
    "la_to_ny_best_travel": {
        "id": "la_to_ny_best_travel",
        "title": "What is the best way to travel from Los Angeles to New York?",
        "quest_scenario": "What is the best way to travel from Los Angeles to New York?",
    },
    "cookie_recipe_ingredients": {
        "id": "cookie_recipe_ingredients",
        "title": "List the ingredients for a basic chocolate chip cookie recipe.",
        "quest_scenario": "List the ingredients for a basic chocolate chip cookie recipe.",
    },
    "car_arrival_time_210_miles": {
        "id": "car_arrival_time_210_miles",
        "title": "If a car travels 60 miles per hour and leaves at 10:00 AM, what time will it arrive at a city 210 miles away?",
        "quest_scenario": "If a car travels 60 miles per hour and leaves at 10:00 AM, what time will it arrive at a city 210 miles away?",
    },
    "tsla_stock_price_now": {
        "id": "tsla_stock_price_now",
        "title": "What is the stock price of Tesla (TSLA) right now?",
        "quest_scenario": "What is the stock price of Tesla (TSLA) right now?",
    },
    "short_history_of_coffee": {
        "id": "short_history_of_coffee",
        "title": "Write a short history of coffee.",
        "quest_scenario": "Write a short history of coffee.",
    },
    "email_week_off_boss": {
        "id": "email_week_off_boss",
        "title": "Draft a quick email to my boss asking for a week off.",
        "quest_scenario": "Draft a quick email to my boss asking for a week off.",
    },
    "solar_vs_wind_benefits": {
        "id": "solar_vs_wind_benefits",
        "title": "What are the benefits of solar power versus wind power?",
        "quest_scenario": "What are the benefits of solar power versus wind power?",
    },
}


def get_level_details(level_id: str) -> Optional[Dict[str, Any]]:
    return _LEVELS.get(level_id)


def get_all_levels() -> List[Dict[str, Any]]:
    return list(_LEVELS.values())
