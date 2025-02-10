// **剧本状态管理**
class Script {
    constructor() {
        this.scriptName = ""; // 剧本名称
        this.tags = []; // 标签
        this.description = ""; // 剧本简介
        this.worldview = ""; // 世界观
        this.validationErrors = new Set(); // 存储验证错误
    }

    /** 设置剧本名称 */
    setScriptName(name) {
        this.scriptName = name.trim();
        this.validate();
    }

    /** 设置标签 */
    setTags(tags) {
        this.tags = Array.isArray(tags) ? tags : [];
        this.validate();
    }

    /** 设置剧本简介 */
    setDescription(description) {
        this.description = description.trim();
        this.validate();
    }

    /** 设置世界观描述 */
    setWorldview(worldview) {
        this.worldview = worldview.trim();
        this.validate();
    }

    /** 更新验证错误 */
    updateValidationErrors() {
        const errors = new Set();

        if (!this.scriptName.trim()) errors.add("剧本名称");
        if (this.tags.length === 0) errors.add("至少选择一个标签");
        if (!this.description.trim()) errors.add("剧本简介");
        if (!this.worldview.trim()) errors.add("世界观描述");

        this.validationErrors = errors;
    }

    /** 运行验证逻辑 */
    validate() {
        this.updateValidationErrors();
        return this.validationErrors.size === 0;
    }

    /** 导出剧本数据 */
    export() {
        return {
            scriptName: this.scriptName,
            tags: this.tags,
            description: this.description,
            worldview: this.worldview,
            validationErrors: Array.from(this.validationErrors),
        };
    }

    /** 导入剧本数据 */
    import(data) {
        if (data.scriptName) this.scriptName = data.scriptName;
        if (data.tags) this.tags = Array.isArray(data.tags) ? data.tags : [];
        if (data.description) this.description = data.description;
        if (data.worldview) this.worldview = data.worldview;
        if (data.validationErrors) this.validationErrors = new Set(data.validationErrors);
    }

    /** 保存剧本数据到 localStorage */
    save(key = "factory-script") {
        const data = this.export();
        localStorage.setItem(key, JSON.stringify(data));
    }

    /** 从 localStorage 加载剧本数据 */
    load(key = "factory-script") {
        const data = localStorage.getItem(key);
        if (data) {
            this.import(JSON.parse(data));
            return true;
        }
        return false;
    }

    /** 清除剧本数据 */
    clear() {
        this.scriptName = "";
        this.tags = [];
        this.description = "";
        this.worldview = "";
        this.validationErrors.clear();
    }
}

// **创建并导出单例实例**
export const scriptState = new Script();

/** 监听状态变化 */
const listeners = new Set();

/** 添加监听器 */
export const subscribeToScript = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

/** 通知所有监听器状态已改变 */
const notifyListeners = () => {
    listeners.forEach((listener) => listener(scriptState.export()));
};

/** 创建代理，自动通知状态变化 */
export const script = new Proxy(scriptState, {
    set(target, property, value) {
        target[property] = value;
        target.validate(); // 触发验证
        notifyListeners();
        return true;
    },
});
