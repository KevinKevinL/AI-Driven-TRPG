from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()

# 打印 HF_HOME 路径，确认加载是否成功
hf_home = os.getenv("HF_HOME")
print(f"HF_HOME 路径: {hf_home}")

# 设置 HF_HOME 环境变量
if hf_home:
    os.environ["HF_HOME"] = hf_home
else:
    print("HF_HOME 未在 .env 文件中配置！")



# ai_engine.py
from transformers import AutoTokenizer, AutoModelForCausalLM
from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()

# 获取 Hugging Face Token
HUGGINGFACE_HUB_TOKEN = os.getenv("HUGGINGFACE_HUB_TOKEN")

def load_llama():
    """
    从 Hugging Face 加载 LLaMA 模型。
    """
    model_name = "meta-llama/Llama-2-7b-chat-hf"
    print("正在加载 LLaMA 模型，请稍候...")

    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        use_auth_token=HUGGINGFACE_HUB_TOKEN
    )
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        use_auth_token=HUGGINGFACE_HUB_TOKEN,
        device_map="auto",
        torch_dtype="auto"
    )

    print("模型加载完成！")
    return tokenizer, model

def generate_response(tokenizer, model, context, user_input, max_length=150):
    """
    使用 LLaMA 模型生成 NPC 响应。
    """
    prompt = f"场景描述: {context}\n玩家说: {user_input}\nNPC回应:"
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(inputs.input_ids, max_length=max_length, temperature=0.7)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response[len(prompt):].strip()

if __name__ == "__main__":
    tokenizer, model = load_llama()
    context = "你站在一个古老的废弃神庙前，门上布满苔藓。"
    user_input = "我想推开门，看看里面有什么。"
    response = generate_response(tokenizer, model, context, user_input)
    print(f"NPC回应: {response}")
