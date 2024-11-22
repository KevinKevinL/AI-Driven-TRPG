from dotenv import load_dotenv
import os

# 加载 .env 文件
load_dotenv()

# 获取 Hugging Face Token
token = os.getenv("HUGGINGFACE_HUB_TOKEN")

if token:
    print(f"Hugging Face Token 配置成功: {token[:10]}...")  # 仅显示前10位
else:
    print("Hugging Face Token 配置失败，请检查 .env 文件！")
