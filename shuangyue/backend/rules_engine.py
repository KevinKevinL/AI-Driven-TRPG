from pyDatalog import pyDatalog

# 初始化PyDatalog
pyDatalog.clear()

# 定义技能判定规则
pyDatalog.create_terms('has_skill, skill_check, result')

# 玩家技能数据
+has_skill('player', 'strength', 10)
+has_skill('player', 'intelligence', 8)

# 技能判定规则：技能值 + 骰子点数 >= 难度则成功
skill_check(player, skill, dice_roll, difficulty) <= (
    has_skill(player, skill, skill_value) &
    (skill_value + dice_roll >= difficulty)
)

# 根据技能判定结果返回成功或失败
result(player, skill, dice_roll, difficulty) <= (
    skill_check(player, skill, dice_roll, difficulty) & (lambda: '成功')
) | (
    ~skill_check(player, skill, dice_roll, difficulty) & (lambda: '失败')
)

# 示例调用
player = 'player'
skill = 'strength'
dice_roll = 5  # 假设玩家掷骰结果为5
difficulty = 12  # 难度值

if __name__ == '__main__':
    print(result(player, skill, dice_roll, difficulty))  # 输出: 成功
