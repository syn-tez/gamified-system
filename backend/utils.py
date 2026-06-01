def calculate_exp_and_level(current_exp: int, current_level: int, added_exp: int):
    total_exp = current_exp + added_exp
    new_level = current_level + (total_exp // 100)
    remainder_exp = total_exp % 100

    return remainder_exp, new_level