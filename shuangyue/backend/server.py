from flask import Flask, request, jsonify
from ai_engine import generate_npc_response
from rules_engine import result

app = Flask(__name__)

# 当前场景描述
current_context = "你站在一个古老的废弃神庙前。"

@app.route('/get-response', methods=['POST'])
def get_response():
    data = request.json
    user_input = data.get('message', '')

    # 使用LangChain生成NPC对话
    npc_response = generate_npc_response(current_context, user_input)

    # 假设触发技能判定逻辑
    dice_roll = 5  # 这里可以用真实的随机数生成器
    skill_check_result = result('player', 'strength', dice_roll, 12)

    # 返回组合结果
    return jsonify({
        'npc_response': npc_response,
        'skill_check': skill_check_result
    })

if __name__ == '__main__':
    app.run(debug=True)
